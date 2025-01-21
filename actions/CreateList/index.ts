"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { Action, ENTITY_TYPE } from "@prisma/client";

import { InputType, ReturnType } from "./types";
import { CreateList } from "./schema";

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

  const { title, boardId } = data;
  let list;

  try {
    const board = await db.board.findUnique({
      where: {
        id: boardId,
        orgId
      }
    });

    if(!board) {
      return {
        error: "Board not found",
      }
    }

    const lastList = await db.list.findFirst({
      where: { boardId: boardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastList ? lastList.order + 1 : 1;

    list = await db.list.create({
      data: {
        title,
        boardId,
        order: newOrder,
      }
    });
    
    await createAuditLog({
      entityTitle: list.title,
      entityId: list.id,
      entityType: ENTITY_TYPE.LIST,
      action: Action.CREATE,
    });  
  } catch(error) {
    return {
      error: "Failed to create list.",
    }
  }

  revalidatePath(`board/${boardId}`);
  return { data: list };
};

export const createList = createSafeAction(CreateList, handler);
