"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { resolvePost, submitPost } from "@/lib/my-posts";
import { can } from "@/lib/permissions";
import { toPostInput, validatePost, type PostFormState } from "@/lib/post-validate";

export async function createPostAction(_prev: PostFormState, formData: FormData): Promise<PostFormState> {
  const values = toPostInput(formData);
  const user = (await auth())?.user;
  if (!user?.email || !can(user.role, "post:create")) {
    return { errors: {}, values, message: "Không có quyền" };
  }

  const errors = validatePost(values);
  if (Object.keys(errors).length) return { errors, values };

  submitPost(user.email, values);
  revalidatePath("/my-posts");
  return { errors: {}, values: {}, message: "Đã gửi tin, chờ kiểm duyệt", ok: true };
}

export async function resolvePostAction(id: number) {
  const user = (await auth())?.user;
  if (!user?.email || !can(user.role, "post:resolve")) throw new Error("Không có quyền");
  if (resolvePost(user.email, id) !== "ok") return;

  revalidatePath("/my-posts");
  revalidatePath("/posts");
  revalidatePath("/");
  revalidatePath(`/posts/${id}`);
}
