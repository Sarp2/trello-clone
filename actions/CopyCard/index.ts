"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { Action, ENTITY_TYPE } from "@prisma/client";

import { InputType, ReturnType } from "./types";
import { CopyCard } from "./schema";

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

  const { id, boardId } = data;
  let card;

  try {
    const cardToCopy = await db.card.findUnique({
      where: {
        id,
        list: {
          board: {
            orgId,
          }
        }
      }
    });

    if(!cardToCopy) {
      return {
        error: "Failed to copy",
      };
    }

    const lastCard = await db.card.findFirst({
      where: { listId: cardToCopy.listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    card = await db.card.create({
      data: {
        title: `${cardToCopy.title} - Copy`,
        description: cardToCopy.description,
        order: newOrder,
        listId: cardToCopy.listId,
      }
    });

    await createAuditLog({
      entityTitle: card.title,
      entityId: card.id,
      entityType: ENTITY_TYPE.CARD,
      action: Action.CREATE,
    });
  } catch(error) {
    return {
      error: "Failed to copy",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const copyCard = createSafeAction(CopyCard, handler);
