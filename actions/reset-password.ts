"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import db from "@/prisma/prisma";
import { NewPasswordSchema } from "@/lib/schemas";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";

export const resetPassword = async (data: z.infer<typeof NewPasswordSchema> & { token?: string }) => {
  const { token, password, passwordConfirmation } = data;

  if (!token) {
    return { error: "Missing reset token" };
  }

  if (password !== passwordConfirmation) {
    return { error: "Passwords do not match" };
  }

  try {
    // Validate token
    const existingToken = await getVerificationTokenByToken(token);
    if (!existingToken) {
      return { error: "Invalid or expired token" };
    }

    // Check if token has expired
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return { error: "Reset token has expired" };
    }

    // Find the user linked to the token
    const user = await getUserByEmail(existingToken.email);
    if (!user) {
      return { error: "User not found" };
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete the verification token to prevent reuse
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });

    return { success: "Password reset successful" };
  } catch (error) {
    console.error("Reset password error:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
};
