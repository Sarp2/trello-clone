import { z } from "zod";
import { CopyCard } from "./schema";

import { Card } from "@prisma/client";
import { ActionState } from "@/lib/CreateSafeAction";

export type InputType = z.infer<typeof CopyCard>;
export type ReturnType = ActionState<InputType, Card>;