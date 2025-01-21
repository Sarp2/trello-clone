"use server";

import { revalidatePath } from "next/cache";
import { Action, ENTITY_TYPE } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

import { InputType, ReturnType } from "./types";
import { UpdateBoard } from "./schema";

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

  const { title, id } = data;
  let board;

  try {
    board = await db.board.update({
      where: {
        id,
        orgId,
      },
      data: {
        title,
      }
    });

    await createAuditLog({
      entityTitle: board.title,
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      action: Action.UPDATE,
    });
  } catch(error) {
    return {
      error: "Failed to update board",
    }
  }

  revalidatePath(`board/${id}`);
  return { data: board };
};

export const updateBoard = createSafeAction(UpdateBoard, handler);
