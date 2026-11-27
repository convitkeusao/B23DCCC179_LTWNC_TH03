import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import type { PostFormState } from "@/lib/post-validate";
import PostForm from "./PostForm";

type PostAction = (prev: PostFormState, formData: FormData) => Promise<PostFormState>;

function setup(state: PostFormState = { errors: {}, values: {} }) {
  const action = vi.fn<PostAction>().mockResolvedValue(state);
  render(<PostForm action={action} />);
  return { action, user: userEvent.setup() };
}

test("hiện lỗi của action ngay dưới ô tương ứng", async () => {
  const error = "Tiêu đề tối thiểu 5 ký tự";
  const { user } = setup({ errors: { title: error }, values: { title: "Ví" } });
  await user.click(screen.getByRole("button", { name: "Đăng tin" }));

  const alert = await screen.findByRole("alert");
  const title = screen.getByLabelText("Tiêu đề");
  expect(alert).toHaveTextContent(error);
  expect(title.nextElementSibling).toBe(alert);
  expect(title).toHaveAccessibleDescription(error);
  expect(screen.getByLabelText("Mô tả")).not.toHaveAttribute("aria-invalid");
});

test("gửi đúng dữ liệu loại tin và địa chỉ Email qua FormData", async () => {
  const { action, user } = setup({ errors: {}, values: {}, message: "Đã gửi tin, chờ kiểm duyệt", ok: true });
  await user.type(screen.getByLabelText("Tiêu đề"), "Mất thẻ sinh viên");
  await user.selectOptions(screen.getByLabelText("Loại tin"), "Thất lạc");
  await user.selectOptions(screen.getByLabelText("Danh mục"), "Thẻ sinh viên");
  await user.selectOptions(screen.getByLabelText("Địa điểm"), "Thư viện");
  await user.type(screen.getByLabelText("Ngày"), "2020-01-01");
  await user.type(screen.getByLabelText("Mô tả"), "Mình để quên thẻ sinh viên trên bàn gần cửa.");
  await user.selectOptions(screen.getByLabelText("Loại liên hệ"), "Email");
  await user.type(screen.getByLabelText("Thông tin liên hệ"), "an@ptit.edu.vn");
  await user.click(screen.getByRole("button", { name: "Đăng tin" }));

  expect(await screen.findByRole("status")).toHaveTextContent("Đã gửi tin, chờ kiểm duyệt");
  expect(action).toHaveBeenCalledTimes(1);
  const [, formData] = action.mock.calls[0];
  expect(formData).toBeInstanceOf(FormData);
  expect(formData.get("kind")).toBe("Thất lạc");
  expect(formData.get("date")).toBe("2020-01-01");
  expect(formData.get("contactType")).toBe("Email");
  expect(formData.get("contact")).toBe("an@ptit.edu.vn");
  expect(screen.getByLabelText("Tiêu đề")).toHaveValue("");
});

test("hiện thông báo không có quyền và giữ tiêu đề đã nhập", async () => {
  const title = "Mất thẻ sinh viên";
  const { user } = setup({ errors: {}, values: { title }, message: "Không có quyền" });
  await user.type(screen.getByLabelText("Tiêu đề"), title);
  await user.click(screen.getByRole("button", { name: "Đăng tin" }));

  expect(await screen.findByRole("alert")).toHaveTextContent("Không có quyền");
  expect(screen.getByLabelText("Tiêu đề")).toHaveValue(title);
});

test("chọn Zalo làm loại liên hệ mặc định", () => {
  setup();
  expect(screen.getByLabelText("Loại liên hệ")).toHaveValue("Zalo");
});
