import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({
  children,
  className = "",
}: PageContainerProps) {
  return (
    <div
      className={`w-full mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12 ${className}`}
    >
      {children}
    </div>
  );
}
