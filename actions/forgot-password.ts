"use server";

import * as z from "zod";
import { generateVerificationToken } from "@/lib/token";
import { ResetPasswordSchema } from "@/lib/schemas";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/forgotPasswordMail";

export const forgotPassword = async (data: z.infer<typeof ResetPasswordSchema>) => {
    try {
        const validatedData = ResetPasswordSchema.parse(data)

        if (!validatedData) {
            return { error: "Invalid input data" }
        }

        const { email } = validatedData

        const user = await getUserByEmail(email)

        if (!user) {
            return { error: "User not found" }
        }

        const resetToken = await generateVerificationToken(email)
        await sendVerificationEmail(email, resetToken.token)

        return { success: "Forgot Password Email Was Sent" };

    } catch (error) {
        console.error("Register error:", error);

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