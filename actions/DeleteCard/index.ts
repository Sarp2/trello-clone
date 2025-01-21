"use server";

import { revalidatePath } from "next/cache";
import { Action, ENTITY_TYPE } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

import { InputType, ReturnType } from "./types";
import { DeleteCard } from "./schema";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/CreateSafeAction";
import { createAuditLog } from "@/lib/CreateAuditLog";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if(!userId || !orgId) {
    return {
      error: "Unauthorized",
    }
  }

  const { id, boardId } = data;
  let card;

  try {
    card = await db.card.delete({
      where: {
        id,
        list: {
          board: {
            orgId
          }
        }
      }
    });

    await createAuditLog({
      entityTitle: card.title,
      entityId: card.id,
      entityType: ENTITY_TYPE.CARD,
      action: Action.DELETE,
    });
  } catch(error) {
    return {
      error: "Failed to delete",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const deleteCard = createSafeAction(DeleteCard, handler);
