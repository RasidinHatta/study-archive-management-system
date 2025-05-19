import Footer from '@/components/general/Footer';
import Navbar from '@/components/general/Navbar';
import React, { Suspense } from 'react';

const PublicLayout = async ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="sticky top-0 z-50 bg-background shadow-md">
                <Suspense fallback={<div>Loading...</div>}>
                    <Navbar />
                </Suspense>
            </div>
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
};

export default PublicLayout;