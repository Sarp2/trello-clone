"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Action, ENTITY_TYPE } from "@prisma/client";

import { InputType, ReturnType } from "./types";
import { DeleteBoard } from "./schema";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/CreateSafeAction";
import { createAuditLog } from "@/lib/CreateAuditLog";
import { decraseAvailableCount } from "@/lib/OrgLimit";
import { checkSubscription } from "@/lib/subscription";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if(!userId || !orgId) {
    return {
      error: "Unauthorized",
    }
  }

  const isPro = await checkSubscription();

  const { id } = data;
  let board;

  try {
    board = await db.board.delete({
      where: {
        id,
        orgId,
      }
    });
    
    if(!isPro) {
      await decraseAvailableCount();
    }
    
    await createAuditLog({
      entityTitle: board.title,
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      action: Action.DELETE,
    });
  } catch(error) {
    return {
      error: "Failed to delete board",
    }
  }

  revalidatePath(`/organization/${orgId}`);
  redirect(`/organization/${orgId}`);
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);
