import { z } from "zod";
import { UpdateBoard } from "./schema";

import { Board } from "@prisma/client";
import { ActionState } from "@/lib/CreateSafeAction";

export type InputType = z.infer<typeof UpdateBoard>;
export type ReturnType = ActionState<InputType, Board>;
