import AdminSidebar from "@/app/(admin)/components/AdminSidebar";
import { requireAdmin } from "@/lib/supabase/auth-helpers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth check - redirects to login if not authenticated or not admin
  await requireAdmin();

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f5f3]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
