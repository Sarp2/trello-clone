import { z } from "zod";
import { UpdateCard } from "./schema";

import { Card } from "@prisma/client";
import { ActionState } from "@/lib/CreateSafeAction";

export type InputType = z.infer<typeof UpdateCard>;
export type ReturnType = ActionState<InputType, Card>;
