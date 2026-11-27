import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LoginForm from "./LoginForm";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  if (await auth()) redirect("/");

  const { callbackUrl } = await searchParams;
  return (
    <main>
      <h1>Đăng nhập</h1>
      <LoginForm callbackUrl={typeof callbackUrl === "string" ? callbackUrl : "/my-posts"} />
    </main>
  );
}

