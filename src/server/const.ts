import type { Permission } from "@/types";

export const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
export const USERNAME_REGEX = /^[0-9A-Za-z_]{4,24}$/;
export const PERMISSION_NAMES: Record<Permission, string> = {
  0: "user",
  1: "mod",
  2: "admin",
};
