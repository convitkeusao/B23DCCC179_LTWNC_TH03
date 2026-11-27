import { expect, test, vi } from "vitest";
import { today, toPostInput, validatePost } from "./post-validate";

const valid = toPostInput({
  title: "Mất thẻ sinh viên",
  kind: "Thất lạc",
  category: "Thẻ sinh viên",
  place: "Thư viện",
  date: "2020-01-01",
  description: "Mình để quên thẻ sinh viên trên bàn gần cửa.",
  contact: "0912345678",
});

test("tin hợp lệ trả về object lỗi rỗng", () => {
  expect(validatePost(valid)).toEqual({});
});

test("form trống báo đủ lỗi và mặc định liên hệ qua Zalo", () => {
  expect(validatePost(toPostInput(new FormData()))).toEqual({
    title: "Tiêu đề tối thiểu 5 ký tự",
    kind: "Hãy chọn loại tin",
    category: "Hãy chọn danh mục",
    place: "Hãy chọn địa điểm",
    date: "Hãy chọn ngày",
    description: "Mô tả tối thiểu 20 ký tự",
    contact: "Số Zalo gồm 10 chữ số, bắt đầu bằng 0",
  });
});

test("từ chối ngày trong tương lai theo múi giờ Việt Nam", () => {
  vi.useFakeTimers();
  try {
    vi.setSystemTime(new Date("2026-11-05T18:00:00Z"));
    expect(today()).toBe("2026-11-06");
    expect(validatePost({ ...valid, date: "2026-11-06" })).toEqual({});
    expect(validatePost({ ...valid, date: "2026-11-07" })).toEqual({ date: "Ngày không được ở tương lai" });
  } finally {
    vi.useRealTimers();
  }
});

test("từ chối ngày không tồn tại trong lịch", () => {
  expect(validatePost({ ...valid, date: "2020-02-30" })).toEqual({ date: "Hãy chọn ngày" });
});

test("từ chối tiêu đề dưới 5 ký tự sau khi bỏ khoảng trắng hai đầu", () => {
  expect(validatePost({ ...valid, title: "  Mất  " })).toEqual({ title: "Tiêu đề tối thiểu 5 ký tự" });
});

test("từ chối tiêu đề dài hơn 80 ký tự", () => {
  expect(validatePost({ ...valid, title: "a".repeat(81) })).toEqual({ title: "Tiêu đề tối đa 80 ký tự" });
});

test("từ chối loại tin không tồn tại", () => {
  expect(validatePost({ ...valid, kind: "Cho tặng" })).toEqual({ kind: "Hãy chọn loại tin" });
});

test("báo lỗi khi địa chỉ Email sai định dạng", () => {
  expect(validatePost({ ...valid, contactType: "Email", contact: "an@ptit" })).toEqual({ contact: "Email không hợp lệ" });
});

test("chấp nhận địa chỉ Email đúng định dạng", () => {
  expect(validatePost({ ...valid, contactType: "Email", contact: "an@ptit.edu.vn" })).toEqual({});
});

test("báo lỗi khi số điện thoại thiếu chữ số", () => {
  expect(validatePost({ ...valid, contactType: "SĐT", contact: "091234567" })).toEqual({
    contact: "Số điện thoại gồm 10 chữ số, bắt đầu bằng 0",
  });
});

test("gắn lỗi vào trường liên hệ khi loại liên hệ không tồn tại", () => {
  expect(validatePost({ ...valid, contactType: "Khác" })).toEqual({ contact: "Hãy chọn loại liên hệ" });
});
