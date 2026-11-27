import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { can } from "@/lib/permissions";

export const proxy = auth((request) => {
  const { pathname, search } = request.nextUrl;
  if (!request.auth?.user) {
    const login = new URL("/login", request.url);
    login.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(login);
  }

  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  if (isAdminRoute && !can(request.auth.user.role, "post:moderate")) {
    return NextResponse.redirect(new URL("/forbidden", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/my-posts/:path*", "/admin/:path*"],
};

