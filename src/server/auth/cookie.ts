import { SEVEN_DAYS_MS } from "../const";

export function sid_cookie(value: string, name = "sid") {
  return new Bun.Cookie({
    name,
    value,
    path: "/",
    maxAge: SEVEN_DAYS_MS,
    httpOnly: true,
    sameSite: "lax",
  });
}
