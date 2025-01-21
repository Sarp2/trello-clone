"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { ENTITY_TYPE, Action } from "@prisma/client";

import { InputType, ReturnType } from "./types";
import { CreateCard } from "./schema";

import { createSafeAction } from "@/lib/CreateSafeAction";
import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/CreateAuditLog";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if(!userId || !orgId) {
    return {
      error: "Unauthorized",
    }
  }

  const { title, boardId, listId } = data;
  let card;

  try {
    const list = await db.list.findUnique({
      where: {
        id: listId,
        board: {
          orgId,
        }
      }
    });

    if(!list) {
      return {
        error: "List not found",
      };
    }

    const lastCard = await db.card.findFirst({
      where: { listId},
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    card = await db.card.create({
      data: {
        title,
        listId,
        order: newOrder,
      }
    });

    await createAuditLog({
      entityId: card.id,
      entityTitle: card.title,
      entityType: ENTITY_TYPE.CARD,
      action: Action.CREATE,
    })

  } catch(error) {
    return {
      error: "Failed to create card.",
    }
  }

  revalidatePath(`board/${boardId}`);
  return { data: card };
};

export const createCard = createSafeAction(CreateCard, handler);
