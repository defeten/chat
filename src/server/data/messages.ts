import { sqlite } from "./init";
import type { UMSG } from "@/types";

export async function insertMessage({
  id,
  name,
  permission,
  content,
  at,
}: UMSG) {
  await sqlite`INSERT INTO messages (id, name, permission, content, at) VALUES (${id}, ${name}, ${permission}, ${content}, ${at})`;
}

export async function getLatestMessages() {
  const response = await sqlite`SELECT * FROM messages LIMIT 200;`;
  return response;
}
