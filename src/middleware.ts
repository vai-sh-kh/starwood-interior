import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_EMAIL = "vaishakhpat2003@gmail.com";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refreshing the auth token
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Protected admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Allow access to login page
    if (request.nextUrl.pathname === "/admin/login") {
      // If user is already logged in and is admin, redirect to dashboard
      if (user && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        return NextResponse.redirect(
          new URL("/admin", request.url)
        );
      }
      // If user is logged in but not admin, sign them out
      if (user && user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        await supabase.auth.signOut();
      }
      return supabaseResponse;
    }

    // For all other admin routes, require authentication
    if (!user || error) {
      return NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
    }

    // Verify admin email - if user is authenticated but email doesn't match, sign out and redirect
    if (user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      await supabase.auth.signOut();
      return NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

