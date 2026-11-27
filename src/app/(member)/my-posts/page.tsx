import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import PostForm from "@/components/PostForm";
import { formatDate } from "@/lib/format";
import { listMine, parseStatus } from "@/lib/my-posts";
import { can } from "@/lib/permissions";
import type { PostStatus } from "@/types";
import { createPostAction, resolvePostAction } from "./actions";

export const metadata: Metadata = {
  robots: { index: false },
};

const statusLabels: Record<PostStatus, string> = {
  pending: "Chờ duyệt",
  approved: "Đang hiển thị",
  hidden: "Đã ẩn",
};

export default async function MyPostsPage({ searchParams }: PageProps<"/my-posts">) {
  const user = (await auth())?.user;
  if (!user?.email) redirect("/login?callbackUrl=%2Fmy-posts");

  const query = await searchParams;
  const status = parseStatus(query.status);
  const requestedLimit = typeof query.limit === "string" && /^\d+$/.test(query.limit)
    ? Number(query.limit)
    : 0;
  const limit = Number.isSafeInteger(requestedLimit) && requestedLimit > 0 ? requestedLimit : 8;
  const { items, nextCursor, total } = listMine(user.email, status, 0, limit);
  const canResolve = can(user.role, "post:resolve");

  return (
    <main>
      <h1>Tin đăng của tôi</h1>
      <PostForm action={createPostAction} />
      <form action="/my-posts" method="get">
        <label htmlFor="status">Trạng thái</label>
        <select id="status" name="status" defaultValue={status ?? ""}>
          <option value="">Tất cả</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button type="submit">Lọc</button>
      </form>
      <p>Hiển thị {items.length} / {total} tin</p>
      <table>
        <thead>
          <tr>
            <th scope="col">Tiêu đề</th>
            <th scope="col">Ngày</th>
            <th scope="col">Trạng thái</th>
            <th scope="col">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {items.map((post) => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>{formatDate(post.date)}</td>
              <td>{post.resolved ? "Đã nhận lại" : statusLabels[post.status]}</td>
              <td>
                {canResolve && post.status === "approved" && !post.resolved && (
                  <form action={resolvePostAction.bind(null, post.id)}>
                    <button type="submit">Đánh dấu đã nhận lại</button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {nextCursor === null ? <p>Đã hiển thị hết tin</p> : (
        <Link href={{ pathname: "/my-posts", query: { ...(status && { status }), limit: limit + 8 } }}>
          Xem thêm
        </Link>
      )}
    </main>
  );
}

