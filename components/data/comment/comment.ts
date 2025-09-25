import { CommentWithRelations } from "@/components/admin/comments/columns";
import db from "@/prisma/prisma";



export async function getCommentsByDocument(documentId?: string): Promise<CommentWithRelations[]> {
  try {
    const comments = await db.comment.findMany({
      where: documentId ? { documentId } : {},
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        document: {
          select: { id: true, title: true },
        },
        parent: {
          select: { id: true, content: true },
        },
        replies: {
          select: { id: true, content: true, createdAt: true, userId: true },
        },
        _count: {
          select: { replies: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return comments;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return [];
  }
}

export async function getAllDocuments() {
  try {
    const documents = await db.document.findMany({
      where: {
        Comment: {
          some: {}, // Ensures only documents with at least one comment are returned
        },
      },
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        title: "asc",
      },
    });
    return documents;
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    return [];
  }
}
