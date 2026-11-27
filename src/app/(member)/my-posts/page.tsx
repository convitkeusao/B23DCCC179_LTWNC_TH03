import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false },
};

export default function MyPostsPage() {
  return <main><h1>Tin đăng của tôi</h1></main>;
}
