import { z } from "zod";
import { DeleteBoard } from "./schema";

import { Board } from "@prisma/client";
import { ActionState } from "@/lib/CreateSafeAction";

export type InputType = z.infer<typeof DeleteBoard>;
export type ReturnType = ActionState<InputType, Board>;
