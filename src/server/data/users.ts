import { sqlite } from "./init";
import type { BackendUser } from "@/types";

export async function insertUser({
  name,
  permission,
  passwordHash: password,
}: BackendUser) {
  await sqlite`INSERT INTO users (name, permission, password) VALUES (${name}, ${permission}, ${password})`;
}

export async function getUser(
  name: string,
  caseSensitive = true,
): Promise<BackendUser | null> {
  let result = null;
  if (caseSensitive) {
    result = await sqlite`SELECT * FROM users WHERE name = ${name}`.values();
  } else {
    result =
      await sqlite`SELECT * FROM users WHERE LOWER(name) = LOWER(${name})`.values();
  }

  if (result.length === 0) {
    return null;
  }

  result = result[0];
  return {
    name: result[0],
    permission: result[1],
    passwordHash: result[2],
  };
}
