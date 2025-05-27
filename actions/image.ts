"use server"

import { auth } from "@/auth"
import { UserImageSchema } from "@/lib/schemas"
import db from "@/prisma/prisma"
import * as z from "zod"
import cloudinary from 'cloudinary'

const cloudinaryAppName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

export const userImageUpload = async (data: z.infer<typeof UserImageSchema>) => {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    const userId = session.user.id;

    try {
        const validatedData = UserImageSchema.parse(data);
        const { publicId, format } = validatedData;
        
        // Validate publicId format to prevent injection
        if (!/^[a-zA-Z0-9_-]+$/.test(publicId)) {
            return { error: "Invalid image identifier" };
        }

        const url = `https://res.cloudinary.com/${cloudinaryAppName}/image/upload/${publicId}.${format}`;

        // Get existing user data
        const existingUser = await db.user.findUnique({
            where: { id: userId },
            select: { image: true },
        });

        // Update user with new image URL
        await db.user.update({
            where: { id: userId },
            data: { image: url },
        });

        // Delete old image if it exists and is different from new one
        if (existingUser?.image) {
            const matches = existingUser.image.match(/\/upload\/([^\.\/]+)\./);
            const oldPublicId = matches?.[1];

            if (oldPublicId && oldPublicId !== publicId) {
                try {
                    await cloudinary.v2.uploader.destroy(oldPublicId);
                    console.log(`Deleted old image: ${oldPublicId}`);
                } catch (deleteError) {
                    console.error("Failed to delete old image:", deleteError);
                    // Don't fail the whole operation if deletion fails
                }
            }
        }

        return { success: "User image updated successfully!" };

    } catch (error) {
        console.error("Upload error:", error);
        
        // Handle specific error cases
        if (error instanceof z.ZodError) {
            return { error: "Invalid image data format" };
        }

        const errorCode = (error as { code?: string }).code;
        
        if (errorCode === "ETIMEDOUT") {
            return { error: "Connection timeout. Please try again." };
        } else if (errorCode === "503") {
            return { error: "Service unavailable. Please try again later." };
        } else {
            return { error: "An unexpected error occurred. Please try again." };
        }
    }
};