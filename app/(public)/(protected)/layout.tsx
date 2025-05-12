import { auth } from '@/auth';
import { SessionWatcher } from '@/components/auth/SessionWatcher';
import { SessionProvider } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React from 'react';

const ProtectedLayout = async ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const session = await auth()
    if (!session) return redirect("/login")
    return (
        <SessionProvider>
            <SessionWatcher />
            {children}
        </SessionProvider>
    );
};

export default ProtectedLayout;