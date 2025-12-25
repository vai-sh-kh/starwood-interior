export default function NavLinksSkeleton({ isMobile = false }: { isMobile?: boolean }) {
  if (isMobile) {
    return (
      <nav className="flex flex-col w-full items-center gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-6 w-24 bg-gray-200 rounded animate-pulse"
          />
        ))}
      </nav>
    );
  }

  return (
    <div className="hidden md:flex items-center space-x-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="h-4 w-16 bg-gray-200 rounded animate-pulse"
        />
      ))}
    </div>
  );
}

