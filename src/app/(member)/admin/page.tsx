import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { can } from "@/lib/permissions";
import { moderatePost } from "./actions";

export const metadata: Metadata = {
  robots: { index: false },
};

export default async function AdminPage() {
  const session = await auth();
  if (!can(session?.user.role, "post:moderate")) redirect("/forbidden");

  const pending = db.posts.filter((post) => post.status === "pending");
  const approved = db.posts.filter((post) => post.status === "approved").length;
  const hidden = db.posts.filter((post) => post.status === "hidden").length;

  return (
    <main>
      <h1>Kiểm duyệt tin đăng</h1>
      <p>Chờ duyệt: {pending.length} | Đang hiển thị: {approved} | Đã ẩn: {hidden}</p>
      <table>
        <thead>
          <tr>
            <th scope="col">Tiêu đề</th>
            <th scope="col">Ngày</th>
            <th scope="col">Email người đăng</th>
            <th scope="col">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {pending.map((post) => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>{formatDate(post.date)}</td>
              <td>{post.authorEmail}</td>
              <td>
                <form action={moderatePost.bind(null, post.id, "approved")}>
                  <button type="submit">Duyệt</button>
                </form>
                <form action={moderatePost.bind(null, post.id, "hidden")}>
                  <button type="submit">Ẩn</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

