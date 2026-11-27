import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PTIT Found",
    template: "%s | PTIT Found",
  },
  description: "Tìm đồ thất lạc trong trường PTIT",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <header>
          <nav aria-label="Menu chính">
            <Link href="/">Trang chủ</Link>
            <Link href="/posts">Tin đăng</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
