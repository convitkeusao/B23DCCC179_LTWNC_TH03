import { expect, test } from "vitest";
import { can } from "./permissions";

test("khách chỉ được xem tin", () => {
  expect(can(undefined, "post:view")).toBe(true);
  expect(can(undefined, "post:create")).toBe(false);
  expect(can(undefined, "post:resolve")).toBe(false);
  expect(can(undefined, "post:moderate")).toBe(false);
});

test("thành viên được xem, đăng và đánh dấu nhận lại nhưng không được kiểm duyệt", () => {
  expect(can("member", "post:view")).toBe(true);
  expect(can("member", "post:create")).toBe(true);
  expect(can("member", "post:resolve")).toBe(true);
  expect(can("member", "post:moderate")).toBe(false);
});

test("quản trị viên được xem và kiểm duyệt nhưng không được đăng hoặc đánh dấu nhận lại", () => {
  expect(can("admin", "post:view")).toBe(true);
  expect(can("admin", "post:moderate")).toBe(true);
  expect(can("admin", "post:create")).toBe(false);
  expect(can("admin", "post:resolve")).toBe(false);
});
