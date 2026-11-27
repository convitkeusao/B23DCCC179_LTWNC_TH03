import { expect, test } from "vitest";
import { formatDate, formatTime } from "./format";

test("định dạng ngày theo thứ tự ngày, tháng, năm", () => {
  expect(formatDate("2026-11-05")).toBe("05/11/2026");
});

test("định dạng giờ theo múi giờ Việt Nam", () => {
  expect(formatTime(new Date("2026-11-05T00:02:03Z"))).toBe("07:02:03");
});
