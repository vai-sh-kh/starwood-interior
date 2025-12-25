import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AVATAR_COLORS } from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get hex color for avatar background (for database storage)
 * Uses hex colors from constants.ts, with #BB8FCE as the default/initial color
 * @param name - The name to generate a color for
 * @returns Hex color string (e.g., "#BB8FCE")
 */
export function getAvatarHexColor(name: string): string {
  if (!name) {
    return AVATAR_COLORS[0]; // Return default color #BB8FCE
  }
  
  // Simple hash function to get consistent color for same name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}
