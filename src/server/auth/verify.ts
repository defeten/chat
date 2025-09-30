import { constantTimeEqual } from "@oslojs/crypto/subtle";
import { getSession } from "@/server/data/sessions";
import type { VerifyResult } from "@/types";

export async function verify(req: Request): Promise<VerifyResult> {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) {
    return { ok: false, error: "no cookie header" };
  }

  const cookies = new Bun.CookieMap(cookieHeader);
  const sid = cookies.get("sid");
  if (!sid) {
    return { ok: false, error: "no sid cookie" };
  }

  const [id, secret] = sid.split(".");
  if (!id || !secret) {
    return { ok: false, error: "invalid sid" };
  }

  const session = await getSession(id);
  if (!session) {
    return { ok: false, error: "session does not exist" };
  }

  const secretHash = Bun.CryptoHasher.hash("sha256", secret);
  const secretValid = constantTimeEqual(secretHash, session.secret);
  if (!secretValid) {
    return { ok: false, error: "session invalid" };
  }

  return { ok: true, session };
}
