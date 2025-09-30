import { SEVEN_DAYS_MS } from "../const";
import { insertSession } from "../data/sessions";
import type { Permission, SessionWithToken } from "@/types";

export async function createSession(
  username: string,
  permission: Permission
): Promise<SessionWithToken> {
  const now = Date.now();

  const id = Bun.randomUUIDv7();
  const secret = Bun.randomUUIDv7();
  const secretHash = Bun.CryptoHasher.hash("sha256", secret);

  const token = id + "." + secret;

  const session: SessionWithToken = {
    id,
    secret: secretHash,
    since: now,
    until: now + SEVEN_DAYS_MS,
    token,
    username,
    permission,
  };

  await insertSession(session);

  return session;
}
