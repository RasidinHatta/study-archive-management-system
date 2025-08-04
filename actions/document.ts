"use server"

import { auth } from "@/auth"
import { DocumentSchema } from "@/lib/schemas"
import db from "@/prisma/prisma"
import * as z from "zod"
import cloudinary from 'cloudinary'
import { revalidatePath } from "next/cache"

// Cloudinary configuration
const cloudinaryAppName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

/**
 * Uploads a document to Cloudinary and creates a database record
 * @param file - The file to upload
 * @param data - Document metadata (title, description, subject)
 * @returns Success/error message
 */
export const uploadDocCloudinary = async (
  file: File,
  data: z.infer<typeof DocumentSchema>
) => {
  // Verify user session
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    // Convert file to buffer and then to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.v2.uploader.upload(dataUri, {
      upload_preset: "sams-doc", // Using predefined upload preset
    });

    // Extract document metadata
    const { title, description, subject } = data;
    const { public_id, format, resource_type } = uploadResponse;
    
    // Construct document URL
    const url = `https://res.cloudinary.com/${cloudinaryAppName}/image/upload/${public_id}.${format}`;

    // Create database record
    await db.document.create({
      data: {
        title,
        description,
        subject,
        url,
        publicId: public_id,
        format,
        resourceType: resource_type,
        userId: session.user.id, // Associate with current user
      },
    });

    return { success: "Document uploaded successfully!" };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      error: (error as { message?: string }).message ?? 
            "An unexpected error occurred. Please try again later.",
    };
  }
};

/**
 * Updates document metadata in the database
 * @param documentId - ID of document to update
 * @param data - New title and/or description
 * @returns Success/error response
 */
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

    // Update document in database
    await db.document.update({
      where: { id: documentId },
      data: {
        ...data,
        updatedAt: new Date(), // Always update the timestamp
      },
    })

    // Revalidate the cache for the documents page
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

/**
 * Deletes a document from Cloudinary
 * @param publicId - Cloudinary public ID of the document
 * @returns Cloudinary deletion result
 */
export const deleteDocumentFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error("Failed to delete Document:", error)
    throw new Error("Document deletion failed.")
  }
}

/**
 * Deletes a document from both database and Cloudinary
 * @param id - Database ID of the document to delete
 * @returns Success/error response
 */
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
        // Continue even if Cloudinary deletion fails
      }
    }

    // Revalidate the documents page cache
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