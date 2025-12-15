// types/next-auth.d.ts
import { Role } from "@/lib/generated/prisma";
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      isOauth?: boolean;
      twoFactorEnabled?: boolean;
      emailVerified?: string | Date | null;
      role?: Role;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    twoFactorEnabled?: boolean;
    emailVerified?: string | Date | null;
    isOauth?: boolean;
    role?: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    isOauth?: boolean;
    twoFactorEnabled?: boolean;
    emailVerified?: string | Date | null;
    role: Role;
  }
}
