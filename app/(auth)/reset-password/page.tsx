import ResetPasswordForm from '@/components/auth/forms/ResetPasswordForm'
import React, { Suspense } from 'react'

const resetPasswordPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    )
}

export default resetPasswordPage