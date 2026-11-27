import { beforeEach, expect, test } from "vitest";
import { generatePosts } from "@/data/posts";
import { db } from "./db";
import { listMine, parseStatus, resolvePost, submitPost } from "./my-posts";
import { toPostInput } from "./post-validate";

const sv01 = "sv01@ptit.edu.vn";
const sv02 = "sv02@ptit.edu.vn";

beforeEach(() => {
  db.posts = generatePosts(36);
  db.nextPostId = 37;
});

test("trang đầu của sv01 trả 8 trên 27 tin và con trỏ kế tiếp là 8", () => {
  const { items, total, nextCursor } = listMine(sv01);
  expect(items).toHaveLength(8);
  expect(items.every((post) => post.authorEmail === sv01)).toBe(true);
  expect(total).toBe(27);
  expect(nextCursor).toBe(8);
});

test("trang cuối của sv01 trả 3 tin và không còn con trỏ kế tiếp", () => {
  const { items, total, nextCursor } = listMine(sv01, undefined, 24);
  expect(items).toHaveLength(3);
  expect(total).toBe(27);
  expect(nextCursor).toBeNull();
});

test("lọc theo trạng thái chờ duyệt trả đúng 3 tin của sv01", () => {
  const { items, total } = listMine(sv01, parseStatus("pending"));
  expect(items).toHaveLength(3);
  expect(total).toBe(3);
  expect(items.every((post) => post.authorEmail === sv01 && post.status === "pending")).toBe(true);
});

test("sv02 có 9 tin và bộ lọc lạ được bỏ qua", () => {
  const { items, total, nextCursor } = listMine(sv02, parseStatus("unknown"), 0, 16);
  expect(items).toHaveLength(9);
  expect(items.every((post) => post.authorEmail === sv02)).toBe(true);
  expect(total).toBe(9);
  expect(nextCursor).toBeNull();
});

test("đăng tin mới đưa tin chờ duyệt lên đầu và ghép liên hệ vào mô tả", () => {
  const input = toPostInput({
    title: "Mất thẻ sinh viên",
    kind: "Thất lạc",
    category: "Thẻ sinh viên",
    place: "Thư viện",
    date: "2020-01-01",
    description: "Mình để quên thẻ sinh viên trên bàn gần cửa.",
    contact: "0912345678",
  });
  const post = submitPost(sv01, input);
  expect(post).toMatchObject({
    id: 37,
    authorEmail: sv01,
    status: "pending",
    resolved: false,
    description: `${input.description}\nLiên hệ: Zalo 0912345678`,
  });
  expect(db.posts[0]).toBe(post);
  expect(db.nextPostId).toBe(38);
});

test("không cho đánh dấu nhận lại tin của người khác", () => {
  expect(resolvePost(sv01, 1)).toBe("forbidden");
  expect(db.posts.find((post) => post.id === 1)?.resolved).toBe(false);
});

test("trả lỗi không tìm thấy khi mã tin không tồn tại", () => {
  expect(resolvePost(sv01, 999)).toBe("not-found");
});

test("đánh dấu nhận lại thành công cho tin đã duyệt của chính mình", () => {
  expect(resolvePost(sv01, 2)).toBe("ok");
  expect(db.posts.find((post) => post.id === 2)?.resolved).toBe(true);
});

test("không cho đánh dấu nhận lại tin của mình khi chưa được duyệt", () => {
  expect(resolvePost(sv02, 5)).toBe("not-approved");
  expect(db.posts.find((post) => post.id === 5)?.resolved).toBe(false);
});
