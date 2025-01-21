import { z } from "zod";
import { DeleteCard } from "./schema";

import { Card } from "@prisma/client";
import { ActionState } from "@/lib/CreateSafeAction";

export type InputType = z.infer<typeof DeleteCard>;
export type ReturnType = ActionState<InputType, Card>;