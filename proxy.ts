import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const adminSession = request.cookies.get("admin_session");
  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isAdminApiRoute =
    request.nextUrl.pathname === "/api/projects" ||
    request.nextUrl.pathname.startsWith("/api/projects/");

  if (isAdminRoute && !isLoginPage && !adminSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isAdminApiRoute && !adminSession) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (isLoginPage && adminSession) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/projects/:path*"],
};
