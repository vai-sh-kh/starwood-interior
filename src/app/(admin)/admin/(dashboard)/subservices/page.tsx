"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Subservices Admin Page - Temporarily Disabled
 * Redirects to admin dashboard
 */
export default function SubservicesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <p className="text-gray-500">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
