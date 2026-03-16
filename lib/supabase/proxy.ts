import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // If user is not logged in and trying to access protected routes
  if (!user && (pathname.startsWith("/dashboard") || pathname.startsWith("/admin"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // If user is logged in, check subscription status for dashboard routes
  if (user && pathname.startsWith("/dashboard")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_status, subscription_expires_at, role")
      .eq("id", user.id)
      .single();

    if (profile && profile.role !== "admin") {
      const now = new Date();
      const expiresAt = profile.subscription_expires_at ? new Date(profile.subscription_expires_at) : null;

      // If subscription is inactive or expired, redirect to subscription page
      if (profile.subscription_status === "inactive" || 
          profile.subscription_status === "expired" || 
          (expiresAt && expiresAt < now)) {
        const url = request.nextUrl.clone();
        url.pathname = "/subscription-expired";
        return NextResponse.redirect(url);
      }
    }
  }

  // If user is logged in and trying to access admin panel, verify admin role
  if (user && pathname.startsWith("/admin")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // If user is logged in and on auth pages, redirect to dashboard
  if (user && pathname.startsWith("/auth/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
