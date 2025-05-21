import React from 'react'
import { Lock } from 'lucide-react'
import Link from 'next/link'

const AccessDeniedPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center p-6">
      <Lock className="w-16 h-16 text-destructive mb-4" />
      <h1 className="text-2xl font-semibold text-destructive mb-2">Access Denied</h1>
      <p className="text-muted-foreground mb-4">You don't have access to this page.</p>
      <Link href="/" className="text-primary hover:underline">
        Go back to Home
      </Link>
    </div>
  )
}

export default AccessDeniedPage