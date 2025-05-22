import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { LoginSchema } from "./lib/schemas";
import db from "./prisma/prisma";
import bcrypt from "bcryptjs";

export default {
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async (credentials) => {
        const validatedCredentials = LoginSchema.parse(credentials);

        const user = await db.user.findFirst({
          where: {
            email: validatedCredentials.email,
          },
          include: {
            role: true // Include the role relation
          }
        });

        if (!user || !user.password || !user.email) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          validatedCredentials.password,
          user.password
        );

        if (!passwordMatch) return null;

        // Return the user object with role included
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          emailVerified: user.emailVerified,
          twoFactorEnabled: user.twoFactorEnabled,
          role: user.role, // Include the role
          roleName: user.roleName // Include roleName if needed
        };
      },
    })
  ],
  pages: {
    signIn: "/login",
    error: "/auth-error"
  },
} satisfies NextAuthConfig;