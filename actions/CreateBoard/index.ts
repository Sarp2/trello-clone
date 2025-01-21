"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { Action, ENTITY_TYPE } from "@prisma/client";

import { CreateBoard } from "./schema";
import { InputType, ReturnType } from "./types";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/CreateSafeAction";
import { createAuditLog } from "@/lib/CreateAuditLog";
import {
  incrementAvailableCount,
  checkAvailableCount,
} from "@/lib/OrgLimit";
import { checkSubscription } from "@/lib/subscription";


const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const canCreate = await checkAvailableCount();
  const isPro = await checkSubscription();

  if(!canCreate && !isPro) {
    return {
      error: "You have reached your limit of free boards. Please upgrade your plan to create more."
    }
  }

  const { title, image } = data;

  const [
    imageId,
    imageThumbUrl,
    imageFullUrl,
    imageLinkHTML,
    imageUserName,
  ] = image.split("|");

  if (!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName) {
    return {
      error: "Missing fields. Failed to create board",
    }
  }

  let board;

  try {
    board = await db.board.create({
      data: {
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName,
      }
    });
    
    if(!isPro) {
      await incrementAvailableCount();
    }

    await createAuditLog({
      entityTitle: board.title,
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      action: Action.CREATE,
    });

  } catch (error) {
    return {
      error: "Failed to create board",
    }
  }

  revalidatePath(`/board/${board.id}`);

  return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);