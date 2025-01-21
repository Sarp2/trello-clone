import { z } from "zod";
import { UpdateCardOrder } from "./schema";

import { Card } from "@prisma/client";
import { ActionState } from "@/lib/CreateSafeAction";

export type InputType = z.infer<typeof UpdateCardOrder>;
export type ReturnType = ActionState<InputType, Card[]>;
