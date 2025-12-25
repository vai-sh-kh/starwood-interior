import { getAvatarHexColor } from "@/lib/utils";

interface LeadAvatarProps {
  name: string;
  avatarColor?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * LeadAvatar component - Displays a round avatar with initials (Google-style)
 * Uses hex colors from constants, with #BB8FCE as the default/initial color
 * Automatically generates color if avatarColor is not provided
 */
export default function LeadAvatar({
  name,
  avatarColor,
  size = "md",
  className = "",
}: LeadAvatarProps) {
  // Get initials from name (first letter of each word, max 2)
  const getInitials = (name: string): string => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Determine the background color
  // If avatarColor is provided and is a hex color, use it
  // Otherwise, if avatarColor is provided but not hex (old format), fall back to constants
  // If no avatarColor, generate from name using constants
  let backgroundColor: string;
  if (avatarColor && avatarColor.trim()) {
    // Check if it's a hex color (starts with #)
    if (avatarColor.trim().startsWith("#")) {
      backgroundColor = avatarColor.trim();
    } else {
      // Old format (Tailwind classes), fall back to constants
      backgroundColor = getAvatarHexColor(name || "?");
    }
  } else {
    // No color provided, use constants
    backgroundColor = getAvatarHexColor(name || "?");
  }

  // Size classes
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center shrink-0 font-semibold text-white ${className}`}
      style={{ backgroundColor }}
    >
      <span>{getInitials(name)}</span>
    </div>
  );
}
