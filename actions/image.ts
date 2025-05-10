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
        const url = `https://res.cloudinary.com/${cloudinaryAppName}/image/upload/${publicId}.${format}`;

        // 🔥 Fetch old image public ID
        const existingUser = await db.user.findUnique({
            where: { id: userId },
            select: { image: true },
        });

        if (existingUser?.image) {
            // Extract public ID from full URL
            const oldUrl = existingUser.image;
            const matches = oldUrl.match(/\/upload\/([^\.\/]+)\./);
            const oldPublicId = matches?.[1];

            console.log("old public id ", oldPublicId)

            if (oldPublicId && oldPublicId !== publicId) {
                await oldImageDelete(oldPublicId); // Delete old image if different
            }
        }

        await db.user.update({
            where: { id: userId },
            data: { image: url },
        });

        return { success: "User image updated!" };
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
};

export const oldImageDelete = async (publicId: string) => {
    try {
        const result = await cloudinary.v2.uploader.destroy(publicId)
        return result
    } catch (error) {
        console.error("Failed to delete image:", error)
        throw new Error("Image deletion failed.")
    }
}