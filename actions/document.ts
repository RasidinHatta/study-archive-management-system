"use server"

import { auth } from "@/auth";
import { DocumentSchema } from "@/lib/schemas";
import db from "@/prisma/prisma";
import * as z from "zod";
import cloudinary from 'cloudinary'

const cloudinaryAppName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

export const documentUpload = async (data: z.infer<typeof DocumentSchema>) => {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }
    const userId = session.user.id;
    try {
        const validatedData = DocumentSchema.parse(data);
        const { title, description, publicId, format, resourceType } = validatedData;
        const url = `https://res.cloudinary.com/${cloudinaryAppName}/image/upload/${publicId}.pdf`

        await db.document.create({
            data: {
                title,
                description,
                url,
                publicId,
                format,
                resourceType,
                userId,
            }
        });

        return { success: "Document uploaded successfully!" };
    } catch (error) {
        console.error("Upload error:", error);

        if ((error as { code: string }).code === "ETIMEDOUT") {
            return {
                error: "Unable to connect to the database. Please try again later.",
            };
        } else if ((error as { code: string }).code === "503") {
            return {
                error: "Service temporarily unavailable. Please try again later.",
            };
        } else {
            return {
                error: "An unexpected error occurred. Please try again later.",
            };
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