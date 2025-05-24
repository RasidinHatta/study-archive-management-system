"use server"

import db from "@/prisma/prisma"
import { revalidatePath } from "next/cache"


export const getDocumentById = async (id: string) => {
    try {
        const doc = await db.document.findUnique({
            where: { id },
            include: { user: true }
        })

        if (!doc) {
            return { success: false, error: "Document not found" }
        }

        return {
            success: true,
            data: {
                ...doc,
                createdAt: doc.createdAt.toISOString(),
                updatedAt: doc.updatedAt.toISOString()
            }
        }
    } catch (error) {
        console.error("Failed to fetch document:", error)
        return { success: false, error: "Failed to fetch document's details" }
    }
}

export const getDocumentComments = async (id: string) => {
    try {
        const comments = await db.comment.findMany({
            where: { documentId: id },
            include: { user: true } // Make sure to include the user
        });

        if (!comments) {
            return { success: false, error: "No comments found" }
        }

        return {
            success: true,
            data: comments
        }
    } catch (error) {
        console.error("Failed to fetch comments:", error)
        return { success: false, error: "Failed to fetch comments" }
    }
}

export const editDocumentById = async (
    documentId: string,
    data: {
        title?: string
        description?: string | null
    }
): Promise<{
    success: boolean
    error?: string
    document?: Document
}> => {
    try {
        // Input validation
        if (data.title && data.title.trim().length < 2) {
            return { success: false, error: "Title must be at least 2 characters" }
        }

        if (data.title && data.title.length > 100) {
            return { success: false, error: "Title cannot exceed 100 characters" }
        }

        if (data.description && data.description.length > 500) {
            return { success: false, error: "Description cannot exceed 500 characters" }
        }

        await db.document.update({
            where: { id: documentId },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        })

        revalidatePath("/admin/documents")

        return {
            success: true,
        }
    } catch (error) {
        console.error("Document update failed:", error)

        if (error instanceof Error) {
            return {
                success: false,
                error: error.message || "Failed to update document"
            }
        }

        return {
            success: false,
            error: "An unknown error occurred"
        }
    }
}

export const deleteDocumentById = async (id: string) => {
 try {
    await db.document.delete({
      where: { id }
    })
    // Revalidate the path if needed
    revalidatePath("/admin/documents")
    return { success: true }
  } catch (error) {
    console.error("Delete failed:", error)
    return { success: false, error: "Failed to delete document" }
  }
}