"use server"

import { auth } from "@/auth"
import { CommentSchema } from "@/lib/schemas"
import db from "@/prisma/prisma"
import * as z from "zod"

// Create a new comment
export const createComment = async (rawData: z.infer<typeof CommentSchema>) => {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const parse = CommentSchema.safeParse(rawData);
  if (!parse.success) {
    return { error: "Invalid data", issues: parse.error.flatten() };
  }

  const { content, documentId, parentId, mainId } = parse.data;

  try {
    // If it's a reply (has parentId), we need to determine the mainId
    const actualMainId = parentId 
      ? mainId || parentId  // Use provided mainId or parentId as mainId
      : null;               // No mainId for root comments

    await db.comment.create({
      data: {
        content,
        documentId,
        userId: session.user.id,
        parentId: parentId ?? null,
        mainId: actualMainId,
      },
    });

    return { success: "Comment posted successfully!" };
  } catch (error) {
    console.error("Failed to post comment:", error);
    return {
      error:
        (error as { message?: string }).message ??
        "Failed to post comment. Please try again later.",
    };
  }
};

// Get all comments for a specific document
export const getCommentsByDocumentId = async (documentId: string) => {
  try {
    const comments = await db.comment.findMany({
      where: { documentId },
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    })

    return comments
  } catch (error) {
    console.error("Failed to fetch comments:", error)
    return []
  }
}
