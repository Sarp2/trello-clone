import { z } from "zod";
import { CopyList } from "./schema";

import { List } from "@prisma/client";
import { ActionState } from "@/lib/CreateSafeAction";

export type InputType = z.infer<typeof CopyList>;
export type ReturnType = ActionState<InputType, List>;