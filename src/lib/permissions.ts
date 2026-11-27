import type { Role } from "@/types";

export type Action = "post:view" | "post:create" | "post:resolve" | "post:moderate";

const permissions: Record<Action, readonly (Role | undefined)[]> = {
  "post:view": [undefined, "member", "admin"],
  "post:create": ["member"],
  "post:resolve": ["member"],
  "post:moderate": ["admin"],
};

export function can(role: Role | undefined, action: Action): boolean {
  return permissions[action].includes(role);
}

