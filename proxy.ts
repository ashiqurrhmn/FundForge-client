import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Protect role-specific dashboard routes
  if (path.startsWith("/admin") || path.startsWith("/creator") || path.startsWith("/supporter")) {
    try {
      // Fetch session from better-auth API endpoint
      const sessionRes = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });

      const sessionData = await sessionRes.json();

      // If no valid session, redirect to login
      if (!sessionData || !sessionData.session || !sessionData.user) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const role = sessionData.user.role || "supporter";

      // Prevent access to other roles' dashboards
      if (path.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
      if (path.startsWith("/creator") && role !== "creator") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
      if (path.startsWith("/supporter") && role !== "supporter") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } catch (e) {
      console.error("Proxy auth check failed:", e);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// Specify the paths the proxy should run on
export const config = {
  matcher: [
    '/admin/:path*',
    '/creator/:path*',
    '/supporter/:path*'
  ],
};
