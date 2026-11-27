"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { can } from "@/lib/permissions";

export async function moderatePost(id: number, status: "approved" | "hidden") {
  const session = await auth();
  if (!can(session?.user.role, "post:moderate")) throw new Error("Không có quyền");

  if (status !== "approved" && status !== "hidden") return;
  const post = db.posts.find((post) => post.id === id && post.status === "pending");
  if (!post) return;

  post.status = status;
  revalidatePath("/admin");
  revalidatePath("/posts");
  revalidatePath("/");
  revalidatePath(`/posts/${id}`);
}

