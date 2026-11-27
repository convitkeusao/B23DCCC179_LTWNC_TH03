import Link from "next/link";
import { getPublicPosts } from "@/lib/posts";

export default async function Home() {
  const posts = await getPublicPosts();

  return (
    <main>
      <h1>PTIT Found – Tìm đồ thất lạc</h1>
      <p>{posts.length} tin đang hiển thị</p>
      <Link href="/posts">Xem tất cả tin</Link>
    </main>
  );
}

