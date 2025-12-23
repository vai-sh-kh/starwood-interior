import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Google-style avatar colors (similar to Google Contacts)
const AVATAR_COLORS = [
  { bg: "bg-red-500", text: "text-white" },
  { bg: "bg-pink-500", text: "text-white" },
  { bg: "bg-purple-500", text: "text-white" },
  { bg: "bg-indigo-500", text: "text-white" },
  { bg: "bg-blue-500", text: "text-white" },
  { bg: "bg-cyan-500", text: "text-white" },
  { bg: "bg-teal-500", text: "text-white" },
  { bg: "bg-green-500", text: "text-white" },
  { bg: "bg-lime-500", text: "text-white" },
  { bg: "bg-yellow-500", text: "text-white" },
  { bg: "bg-amber-500", text: "text-white" },
  { bg: "bg-orange-500", text: "text-white" },
  { bg: "bg-red-600", text: "text-white" },
  { bg: "bg-pink-600", text: "text-white" },
  { bg: "bg-purple-600", text: "text-white" },
  { bg: "bg-indigo-600", text: "text-white" },
  { bg: "bg-blue-600", text: "text-white" },
  { bg: "bg-cyan-600", text: "text-white" },
  { bg: "bg-teal-600", text: "text-white" },
  { bg: "bg-green-600", text: "text-white" },
] as const;

/**
 * Generate a consistent avatar color based on a name (Google-style)
 * @param name - The name to generate a color for
 * @returns An object with bg and text color classes
 */
export function getAvatarColor(name: string): { bg: string; text: string } {
  if (!name) {
    return AVATAR_COLORS[0];
  }
  
  // Simple hash function to get consistent color for same name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

/**
 * Get avatar color class string for database storage
 * @param name - The name to generate a color for
 * @returns Color class string (e.g., "bg-blue-500 text-white")
 */
export function getAvatarColorClass(name: string): string {
  const color = getAvatarColor(name);
  return `${color.bg} ${color.text}`;
}
