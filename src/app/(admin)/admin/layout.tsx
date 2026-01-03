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
      <Toaster
        position="top-right"
        richColors
        visibleToasts={5}
        gap={12}
        expand={true}
        toastOptions={{
          duration: 4000,
          style: {
            minWidth: "300px",
            maxWidth: "400px",
            marginBottom: "12px",
          },
        }}
      />
    </>
  );
}
