"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export async function login(_previous: string | null, formData: FormData) {
  const callbackUrl = formData.get("callbackUrl");
  const localPath = typeof callbackUrl === "string" &&
    /^\/(?!\/)[^\\\s]*$/.test(callbackUrl)
    ? callbackUrl
    : "/my-posts";

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: localPath,
    });
    return null;
  } catch (error) {
    if (!(error instanceof AuthError)) throw error;
    if (error.type === "CredentialsSignin") return "Email hoặc mật khẩu không đúng";
    return "Không thể đăng nhập. Vui lòng thử lại.";
  }
}

