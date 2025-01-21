import { z } from "zod";
import { DeleteList } from "./schema";

import { List } from "@prisma/client";
import { ActionState } from "@/lib/CreateSafeAction";

export type InputType = z.infer<typeof DeleteList>;
export type ReturnType = ActionState<InputType, List>;
