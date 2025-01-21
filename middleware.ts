import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { RedirectToSignIn } from "@clerk/nextjs";

const isPublicRoute = createRouteMatcher(["/", "/sign-in", "/sign-up", "/api/webhook"]);

export default clerkMiddleware(async(auth, req) => {
  const { userId, orgId } = await auth();

  if(userId && isPublicRoute(req)) {
    let path = "/select-org";

    if(orgId) {
      path = `/organization/${orgId}`;
    }

    const orgSelection = new URL(path, req.url);

    return NextResponse.redirect(orgSelection);
  };

  if(!userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if(userId && !orgId && req.nextUrl.pathname !== "/select-org") {
    const orgSelection = new URL("/select-org", req.url);
    return NextResponse.redirect(orgSelection);
  }

});



export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};