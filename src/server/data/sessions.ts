import { sqlite } from "./init";
import type { Session } from "@/types";

export async function insertSession({
  id,
  secret,
  username,
  since,
  until,
  permission,
}: Session) {
  await sqlite`INSERT INTO sessions (id, secret, username, since, until, permission) VALUES (${id}, ${secret}, ${username}, ${since}, ${until}, ${permission})`;
}

export async function getSession(id: string): Promise<Session> {
  const [result] = await sqlite`SELECT * FROM sessions WHERE id = ${id}`;

  return result;
}

export async function getUserSessions(name: string): Promise<Session[]> {
  const results =
    await sqlite`SELECT * FROM sessions WHERE LOWER(username) = LOWER(${name})`;

  const mapped = results.map(
    (result: any) =>
      ({
        id: result[0],
        secret: result[1],
        username: result[2],
        since: result[3],
        until: result[4],
        permission: result[5],
      }) satisfies Session,
  );
  return mapped;
}

export async function deleteSession(id: string) {
  await sqlite`DELETE FROM sessions WHERE id = ${id}`;
}

export async function deleteUserSessions(name: string) {
  await sqlite`DELETE FROM sessions WHERE LOWER(username) = LOWER(${name})`;
}
