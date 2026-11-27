"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSession, signOut, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { can } from "@/lib/permissions";

export default function Header() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const pathname = usePathname();
  const previousPath = useRef(pathname);

  useEffect(() => {
    // The login Server Action sets the cookie while SessionProvider stays mounted.
    if (previousPath.current === "/login" && pathname !== "/login") void getSession();
    previousPath.current = pathname;
  }, [pathname]);

  return (
    <header>
      <nav aria-label="Menu chính">
        <Link href="/">Trang chủ</Link>
        <Link href="/posts">Tin đăng</Link>
        {status === "unauthenticated" && <Link href="/login">Đăng nhập</Link>}
        {user && (
          <>
            <span>Xin chào, {user.name} ({user.role})</span>
            <Link href="/my-posts">Tin của tôi</Link>
            {can(user.role, "post:moderate") && <Link href="/admin">Quản trị</Link>}
            <button type="button" onClick={() => void signOut({ redirectTo: "/" })}>
              Đăng xuất
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

