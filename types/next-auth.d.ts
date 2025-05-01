// types/next-auth.d.ts or in your project root
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string | null
      email: string | null
      image: string | null
      isOauth: boolean
      twoFactorEnabled: boolean
      emailVerified: string | null
    }
  }

  interface User {
    id: string
    name: string | null
    email: string | null
    image: string | null
    twoFactorEnabled: boolean
    emailVerified: string | null
  }
}
