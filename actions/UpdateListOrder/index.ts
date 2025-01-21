"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

import { InputType, ReturnType } from "./types";
import { UpdateListOrder } from "./schema";

import { createSafeAction } from "@/lib/CreateSafeAction";
import { db } from "@/lib/db";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if(!userId || !orgId) {
    return {
      error: "Unauthorized",
    }
  }

  const { items, boardId } = data;
  let lists;

  try {
    const transaction = items.map((list) => 
    db.list.update({
      where: {
        id: list.id,
        board: {
          orgId,
        }
      },
      data: {
        order: list.order,
      }
    })
  );

  lists = await db.$transaction(transaction);
} catch(error) {
    return {
      error: "Failed to create reorder",
    }
  }

  revalidatePath(`board/${boardId}`);
  return { data: lists };
};

export const updateListOrder = createSafeAction(UpdateListOrder, handler);
