"use server";

import { revalidatePath } from "next/cache";
import { Action, ENTITY_TYPE } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

import { InputType, ReturnType } from "./types";
import { DeleteList } from "./schema";

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
  let list;

  try {
    list = await db.list.delete({
      where: {
        id,
        boardId,
        board: {
          orgId,
        }
      }
    });

    await createAuditLog({
      entityTitle: list.title,
      entityId: list.id,
      entityType: ENTITY_TYPE.LIST,
      action: Action.DELETE,
    });
  } catch(error) {
    return {
      error: "Failed to delete",
    }
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const deleteList = createSafeAction(DeleteList, handler);
