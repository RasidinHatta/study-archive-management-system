"use server"

import { auth } from "@/auth";
import db from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { AdminProfileSchema, ProfileSchema } from "@/lib/schemas";
import bcrypt from "bcryptjs";

export const updateUserInfo = async (data: z.infer<typeof ProfileSchema>) => {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Not authenticated" }
  }

  // Validate input
  const validatedData = ProfileSchema.safeParse(data)
  if (!validatedData.success) {
    return { error: "Invalid data", issues: validatedData.error.flatten() }
  }

  const {
    name,
    email,
    twoFactorEnabled,
    currentPassword,
    newPassword,
    confirmPassword,
  } = validatedData.data

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return { error: "User not found" }
    }

    // Optional password update
    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        return { error: "Current password is required to change password" }
      }

      if (!user.password) {
        return { error: "Password not set for this user" }
      }
      
      const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password)
      if (!isPasswordCorrect) {
        return { error: "Current password is incorrect" }
      }

      if (newPassword !== confirmPassword) {
        return { error: "New passwords do not match" }
      }

      // We know newPassword is defined here because of the if condition
      const hashedPassword = await bcrypt.hash(newPassword!, 10)

      await db.user.update({
        where: { id: user.id },
        data: {
          name,
          email,
          twoFactorEnabled,
          password: hashedPassword,
        },
      })
    } else {
      // Update without password change
      await db.user.update({
        where: { id: user.id },
        data: {
          name,
          email,
          twoFactorEnabled,
        },
      })
    }

    revalidatePath("/profile")
    return { success: "Profile updated successfully" }
  } catch (error) {
    console.error("Error updating user info:", error)
    return { error: "Failed to update profile" }
  }
}

export const updateAdminInfo = async (data: z.infer<typeof AdminProfileSchema>) => {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Not authenticated" }
  }

  // Validate input
  const validatedData = AdminProfileSchema.safeParse(data)
  if (!validatedData.success) {
    return { error: "Invalid data", issues: validatedData.error.flatten() }
  }

  const { name, twoFactorEnabled } = validatedData.data

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return { error: "User not found" }
    }

    // ✅ Ensure only admins can update via this endpoint
    if (user.roleName !== "ADMIN") {
      return { error: "Not authorized" }
    }

    // Update only name & twoFactorEnabled
    await db.user.update({
      where: { id: user.id },
      data: {
        name,
        twoFactorEnabled,
      },
    })

    revalidatePath("/admin") // ✅ revalidate admin dashboard
    return { success: "Profile updated successfully" }
  } catch (error) {
    console.error("Error updating admin info:", error)
    return { error: "Failed to update profile" }
  }
}

export async function getAdminInfo() {
  const session = await auth()
  if (!session?.user?.id) return null

  return await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, twoFactorEnabled: true, image: true },
  })
}