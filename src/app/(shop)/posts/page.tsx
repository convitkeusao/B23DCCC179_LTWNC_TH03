import Link from "next/link";
import { KINDS } from "@/data/posts";
import { formatDate, formatTime } from "@/lib/format";
import { getPublicPosts } from "@/lib/posts";

export default async function PostsPage({ searchParams }: PageProps<"/posts">) {
  const filters = await searchParams;
  const q = typeof filters.q === "string" ? filters.q : "";
  const kind = KINDS.find((kind) => kind === filters.kind);
  const sort = filters.sort === "date-desc" || filters.sort === "date-asc"
    ? filters.sort
    : undefined;
  const posts = await getPublicPosts({ q, kind, sort });

  return (
    <main>
      <h1>Tin đăng</h1>
      <form action="/posts" method="get">
        <label htmlFor="q">Tìm kiếm</label>
        <input id="q" name="q" type="search" defaultValue={q} />
        <label htmlFor="kind">Loại tin</label>
        <select id="kind" name="kind" defaultValue={kind ?? ""}>
          <option value="">Tất cả</option>
          {KINDS.map((kind) => <option key={kind}>{kind}</option>)}
        </select>
        <label htmlFor="sort">Sắp xếp</label>
        <select id="sort" name="sort" defaultValue={sort ?? ""}>
          <option value="">Mặc định</option>
          <option value="date-desc">Mới nhất</option>
          <option value="date-asc">Cũ nhất</option>
        </select>
        <button type="submit">Lọc</button>
      </form>
      <p>Có {posts.length} tin đang hiển thị</p>
      <p>Render lúc: {formatTime(new Date())}</p>
      {posts.length === 0 ? (
        <p>Không có tin nào phù hợp</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th scope="col">Tiêu đề</th>
              <th scope="col">Loại tin</th>
              <th scope="col">Địa điểm</th>
              <th scope="col">Ngày</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td><Link href={`/posts/${post.id}`}>{post.title}</Link></td>
                <td>{post.kind}</td>
                <td>{post.place}</td>
                <td>{formatDate(post.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

