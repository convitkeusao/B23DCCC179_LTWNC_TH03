import type { ReactNode } from "react";

export default function MemberLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <p>Khu vực thành viên</p>
      {children}
    </>
  );
}

