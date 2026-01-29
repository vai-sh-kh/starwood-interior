"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AdminSidebar from "@/app/(admin)/components/AdminSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || user.email !== "starwoodinteriorsdigital@gmail.com") {
        router.push("/admin/login");
      } else {
        setIsAdmin(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-[#f5f5f3]">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:flex w-64 flex-col gap-4 border-r bg-white p-6">
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-8 w-8 rounded-lg bg-stone-200" />
            <Skeleton className="h-6 w-32 bg-stone-200" />
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg bg-stone-100" />
            ))}
          </div>
        </div>

        {/* content Skeleton */}
        <main className="flex-1 overflow-y-auto relative">
          <div className="p-6 lg:p-8 space-y-8">
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-48 bg-stone-200" />
              <Skeleton className="h-10 w-10 rounded-full bg-stone-200" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl bg-stone-200" />
              ))}
            </div>

            <div className="space-y-4">
              <Skeleton className="h-64 w-full rounded-xl bg-stone-200" />
            </div>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-[2px] z-50">
            <Loader2 className="h-8 w-8 animate-spin text-stone-900 mb-2" />
            <p className="text-sm font-medium text-stone-600">Loading Dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f5f3]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
