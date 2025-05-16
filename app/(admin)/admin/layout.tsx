import { auth } from '@/auth';
import Navbar from '@/components/admin/Navbar';
import SideMenu from '@/components/admin/SideMenu';
import { redirect } from 'next/navigation';

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();

    if (!session?.user) {
        return redirect("/admin-login");
    }

    // If not an admin, redirect to home or a forbidden page
    if (session?.user?.role !== 'ADMIN') {
        return redirect("/");
    }

    return (
        <>
            <div className="border-b">
                <Navbar />
            </div>
            <div className="flex">
                <SideMenu />
                <div className="w-full px-4 pt-8">{children}</div>
            </div>
        </>
    );
};

export default AdminLayout;