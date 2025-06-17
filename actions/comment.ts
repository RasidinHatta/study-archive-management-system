"use server"

import { auth } from "@/auth"
import { CommentSchema } from "@/lib/schemas"
import db from "@/prisma/prisma"
import { revalidatePath } from "next/cache"
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

export const getCommentsByDocumentId = async (documentId: string) => {
  try {
    const comments = await db.comment.findMany({
      where: { documentId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replies: {
          orderBy: { createdAt: "desc" }, // Add this to sort replies
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

export const deleteComment = async (commentId: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // First, find the comment to verify ownership
    const comment = await db.comment.findUnique({
      where: { id: commentId },
      select: { userId: true }
    });

    if (!comment) {
      return { success: false, error: "Comment not found" };
    }

    // Check if the current user is the comment owner
    if (comment.userId !== session.user.id) {
      return { success: false, error: "You can only delete your own comments" };
    }

    // Delete the comment and all its replies (cascade delete)
    await db.comment.delete({
      where: { id: commentId }
    });

    // Revalidate the page to show updated comments
    revalidatePath("/"); // Adjust this path as needed
    return { success: true, message: "Comment deleted successfully" };
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return { 
      success: false, 
      error: (error as Error).message || "Failed to delete comment" 
    };
  }
};
