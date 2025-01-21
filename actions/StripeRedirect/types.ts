import { z } from "zod";

import { StripeRedirect } from "./schema";
import { ActionState } from "@/lib/CreateSafeAction";

export type InputType = z.infer<typeof StripeRedirect>;
export type ReturnType = ActionState<InputType, string>;