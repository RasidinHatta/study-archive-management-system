'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

const ErrorPage = () => {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null): string => {
    const messages: Record<string, string> = {
      AccessDenied: 'Access denied. This email may be linked with another provider.',
      OAuthAccountNotLinked: 'This account is linked to a different sign-in method. Please use the original provider.',
      Configuration: 'A configuration error occurred. Please contact support.',
      CredentialsSignin: 'Invalid login credentials. Please check and try again.',
      Verification: 'Email verification failed or expired. Please try again.',
    }

    return messages[error ?? ''] || 'An unknown error occurred. Please try again or contact support.'
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-6 py-12">
      <div className="max-w-md w-full text-center">
        <AlertTriangle className="text-destructive w-16 h-16 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-destructive mb-2">Authentication Error</h1>
        <p className="text-muted-foreground text-base mb-6">{getErrorMessage(error)}</p>
        <Link
          href="/login"
          className="text-sm font-medium text-primary hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </div>
  )
}

export default ErrorPage