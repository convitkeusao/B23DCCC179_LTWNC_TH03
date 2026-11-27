import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatDate, formatTime } from "@/lib/format";
import { getPublicPost, getPublicPosts } from "@/lib/posts";

export const revalidate = 30;
export const dynamic = "force-static";

export async function generateStaticParams() {
  const posts = await getPublicPosts();
  return posts.slice(0, 10).map(({ id }) => ({ id: String(id) }));
}

async function readPost(params: PageProps<"/posts/[id]">["params"]) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id)) notFound();

  const post = await getPublicPost(Number(id));
  if (!post) notFound();
  return post;
}

export async function generateMetadata({
  params,
}: PageProps<"/posts/[id]">): Promise<Metadata> {
  const post = await readPost(params);
  const title = `${post.title} – ${post.place}`;
  const description = post.description;

  return { title, description, openGraph: { title, description } };
}

export default async function PostDetailPage({ params }: PageProps<"/posts/[id]">) {
  const post = await readPost(params);
  const origin = "http://localhost:3000";
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: `${origin}/` },
      { "@type": "ListItem", position: 2, name: "Tin đăng", item: `${origin}/posts` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${origin}/posts/${post.id}` },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c") }}
      />
      <h1>{post.title}</h1>
      <p>Loại tin: {post.kind}</p>
      <p>Danh mục: {post.category}</p>
      <p>Địa điểm: {post.place}</p>
      <p>Ngày: {formatDate(post.date)}</p>
      <p>Người đăng: {post.authorEmail}</p>
      <p>{post.description}</p>
      <p>Cập nhật lúc: {formatTime(new Date())}</p>
    </main>
  );
}

