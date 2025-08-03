"use server"

import db from "@/prisma/prisma"
import { revalidatePath } from "next/cache"
import cloudinary from 'cloudinary'

const cloudinaryAppName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME


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

        // Prepare update data
        const updateData: {
            title?: string
            description?: string | null
            updatedAt: Date
        } = {
            updatedAt: new Date(),
        }

        // Only include title if provided
        if (data.title) {
            updateData.title = data.title
        }

        // Only include description if it's not an empty string
        if (data.description !== undefined && data.description !== "") {
            updateData.description = data.description
        }

        await db.document.update({
            where: { id: documentId },
            data: updateData,
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
    // First get the document to obtain the publicId before deleting
    const document = await db.document.findUnique({
      where: { id },
      select: { publicId: true }
    });

    if (!document) {
      return { success: false, error: "Document not found" };
    }

    // Delete from database
    await db.document.delete({
      where: { id }
    });

    // If publicId exists, delete from Cloudinary
    if (document.publicId) {
      try {
        await deleteDocumentFromCloudinary(document.publicId);
      } catch (cloudinaryError) {
        console.error("Cloudinary deletion failed:", cloudinaryError);
        // You might want to handle this differently - maybe just log the error
        // but still consider the database deletion successful
      }
    }

    // Revalidate the path
    revalidatePath("/admin/documents");
    return { success: true };
  } catch (error) {
    console.error("Delete failed:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete document" 
    };
  }
}

export const deleteDocumentFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Failed to delete Document from Cloudinary:", error);
    throw new Error("Cloudinary document deletion failed.");
  }
}