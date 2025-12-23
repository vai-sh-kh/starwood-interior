import { createClient } from "./server";
import { redirect } from "next/navigation";

/**
 * Admin email that is allowed to access admin routes
 */
export const ADMIN_EMAIL = "vaishakhpat2003@gmail.com";

/**
 * Verifies if the provided email matches the admin email
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  return email === ADMIN_EMAIL;
}

/**
 * Gets the authenticated admin user from the server
 * Returns null if not authenticated or not the admin email
 */
export async function getAuthenticatedAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Verify the user's email matches the admin email
  if (!isAdminEmail(user.email)) {
    return null;
  }

  return user;
}

/**
 * Requires authentication and admin email verification
 * Redirects to login if not authenticated or not admin
 */
export async function requireAdmin() {
  const user = await getAuthenticatedAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
}

