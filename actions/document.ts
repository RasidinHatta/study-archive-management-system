"use server"

import { auth } from "@/auth"
import { DocumentSchema } from "@/lib/schemas"
import db from "@/prisma/prisma"
import * as z from "zod"
import cloudinary from 'cloudinary'
import { revalidatePath } from "next/cache"

const cloudinaryAppName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

export const uploadDocCloudinary = async (
  file: File,
  data: z.infer<typeof DocumentSchema>
) => {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64 data URI
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const uploadResponse = await cloudinary.v2.uploader.upload(dataUri, {
      upload_preset: "sams-doc",
    });

    const { title, description, subject } = data;
    const { public_id, format, resource_type } = uploadResponse;
    const url = `https://res.cloudinary.com/${cloudinaryAppName}/image/upload/${public_id}.${format}`;

    await db.document.create({
      data: {
        title,
        description,
        subject,
        url,
        publicId: public_id,
        format,
        resourceType: resource_type,
        userId: session.user.id,
      },
    });

    return { success: "Document uploaded successfully!" };
  } catch (error) {
    console.error("Upload error:", error);

    return {
      error:
        (error as { message?: string }).message ??
        "An unexpected error occurred. Please try again later.",
    };
  }
};

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

        revalidatePath("/my-document")

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

export const deleteDocumentFromCloudinary = async (publicId: string) => {
    try {
        const result = await cloudinary.v2.uploader.destroy(publicId)
        return result
    } catch (error) {
        console.error("Failed to delete Document:", error)
        throw new Error("Document deletion failed.")
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
    revalidatePath("/my-documents");
    return { success: true };
  } catch (error) {
    console.error("Delete failed:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete document" 
    };
  }
}