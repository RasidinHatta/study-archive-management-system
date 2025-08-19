"use server"

import { auth } from "@/auth"
import { CommentSchema } from "@/lib/schemas"
import db from "@/prisma/prisma"
import { revalidatePath } from "next/cache"
import * as z from "zod"

/**
 * Creates a new comment or reply
 * @param rawData - Comment data including content, documentId, and optional parentId/mainId
 * @returns Success message or error object
 */
export const createComment = async (rawData: z.infer<typeof CommentSchema>) => {

  // Validate input data using Zod schema
  const parse = CommentSchema.safeParse(rawData);
  if (!parse.success) {
    return { error: "Invalid data", issues: parse.error.flatten() };
  }

  // Extract validated data
  const { userId, content, documentId, parentId, mainId } = parse.data;

  try {
    /**
     * Determine mainId for comment threading:
     * - For replies (has parentId): use provided mainId or parentId as mainId
     * - For root comments: no mainId
     */
    const actualMainId = parentId 
      ? mainId || parentId
      : null;

    // Create comment in database
    await db.comment.create({
      data: {
        content,
        documentId,
        userId,
        parentId: parentId ?? null, // Ensure null instead of undefined
        mainId: actualMainId,
      },
    });

    return { success: "Comment posted successfully!" };
  } catch (error) {
    console.error("Failed to post comment:", error);
    return {
      error: (error as { message?: string }).message ??
             "Failed to post comment. Please try again later.",
    };
  }
};

/**
 * Deletes a comment and all its replies
 * @param commentId - ID of the comment to delete
 * @returns Success/error object
 */
export const deleteComment = async (commentId: string) => {
  // Verify user session
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // First verify comment exists and get owner info
    const comment = await db.comment.findUnique({
      where: { id: commentId },
      select: { userId: true }
    });

    if (!comment) {
      return { success: false, error: "Comment not found" };
    }

    // Verify current user is the comment owner
    if (comment.userId !== session.user.id) {
      return { success: false, error: "You can only delete your own comments" };
    }

    /**
     * Delete comment and all its replies (cascade delete)
     * Note: This assumes your database schema has proper cascade delete setup
     */
    await db.comment.delete({
      where: { id: commentId }
    });

    // Revalidate the page to show updated comment list
    revalidatePath("/"); // Adjust path to match your comment display page

    return { success: true, message: "Comment deleted successfully" };
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return { 
      success: false, 
      error: (error as Error).message || "Failed to delete comment" 
    };
  }
};