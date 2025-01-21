import { z } from "zod";
import { CreateCard } from "./schema";

import { Card } from "@prisma/client";
import { ActionState } from "@/lib/CreateSafeAction";

export type InputType = z.infer<typeof CreateCard>;
export type ReturnType = ActionState<InputType, Card>;
