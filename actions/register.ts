"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/lib/schemas";
import db from "@/prisma/prisma";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";
import { RoleName } from "@/lib/generated/prisma";

/**
 * Handles user registration with email verification
 * @param data - Registration data (email, name, password, password confirmation)
 * @returns Object with success/error message
 */
export const register = async (data: z.infer<typeof RegisterSchema>) => {
  try {
    // Validate input data against the registration schema
    const validatedData = RegisterSchema.parse(data);
    const { email, name, password, passwordConfirmation } = validatedData;

    // Double-check password match (already validated by schema)
    if (password !== passwordConfirmation) {
      return { error: "Passwords do not match" };
    }

    // Normalize email to lowercase to prevent case-sensitive duplicates
    const lowerCaseEmail = email.toLowerCase();

    // Check if user already exists in database
    const userExists = await db.user.findFirst({
      where: { email: lowerCaseEmail },
    });

    if (userExists) {
      return { error: "Email is already in use. Please try another one." };
    }

    /**
     * Determine user role based on email domain:
     * - @graduate.utm.my → USER role
     * - All others → PUBLICUSER role
     */
    const roleName: RoleName = lowerCaseEmail.endsWith("@graduate.utm.my")
      ? RoleName.USER
      : RoleName.PUBLICUSER;

    // Securely hash password with bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user record in database
    await db.user.create({
      data: {
        email: lowerCaseEmail,
        name,
        password: hashedPassword,
        roleName,
      },
    });

    // Generate email verification token (expires after 1 hour)
    const verificationToken = await generateVerificationToken(lowerCaseEmail);
    
    // Send verification email with the generated token
    await sendVerificationEmail(lowerCaseEmail, verificationToken.token);

    return { success: "Verification email sent successfully." };
  } catch (error) {
    console.error("Register error:", error);

    // Handle specific database/network errors
    const errorCode = (error as { code?: string }).code;
    if (errorCode === "ETIMEDOUT") {
      return { error: "Database timeout. Try again later." };
    } else if (errorCode === "503") {
      return { error: "Service unavailable. Try again later." };
    } else {
      // Fallback for unexpected errors
      return { error: "An unexpected error occurred. Please try again." };
    }
  }
};