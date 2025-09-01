import Footer from '@/components/navigation/Footer';
import Navbar from '@/components/navigation/Navbar';
import NavbarSkeleton from '@/components/skeletons/NavbarSkeleton ';
import { Separator } from '@/components/ui/separator';
import React, { Suspense } from 'react';

const PublicLayout = async ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="sticky top-0 z-50 bg-background shadow-md">
                <Suspense fallback={<NavbarSkeleton />}>
                    <Navbar />
                </Suspense>
            </div>
            <main className="flex-1">{children}</main>
            <Separator />
            <Footer />
        </div>
    );
};

export default PublicLayout;