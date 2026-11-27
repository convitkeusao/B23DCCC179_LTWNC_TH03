import { db } from "./db";
import type { Kind } from "@/types";

interface PostFilters {
  q?: string;
  kind?: Kind;
  sort?: "date-desc" | "date-asc";
}

export async function getPublicPosts({ q, kind, sort }: PostFilters = {}) {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const query = q?.toLowerCase();
  const posts = db.posts.filter(
    (post) =>
      post.status === "approved" &&
      (!query || post.title.toLowerCase().includes(query)) &&
      (!kind || post.kind === kind),
  );

  if (sort === "date-desc") {
    posts.sort((a, b) => b.date.localeCompare(a.date));
  }
  if (sort === "date-asc") {
    posts.sort((a, b) => a.date.localeCompare(b.date));
  }

  return posts;
}

export async function getPublicPost(id: number) {
  return db.posts.find((post) => post.id === id && post.status === "approved");
}

