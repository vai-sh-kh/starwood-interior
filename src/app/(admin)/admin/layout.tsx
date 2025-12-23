import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Admin - CMS Dashboard",
  description: "Content Management System",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster position="top-right" richColors />
    </>
  );
}
