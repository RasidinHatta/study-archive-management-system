"use client"

import { signOut } from "next-auth/react"

export function SignOutButton() {
  return (
    <button
      className="w-full text-sm text-left pl-2 py-1 text-red-500 hover:bg-muted hover:text-red-600 transition-colors rounded"
      onClick={() => signOut()}
    >
      Sign Out
    </button>
  )
}
