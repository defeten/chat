import { SQL } from "bun";

// put database in parent folder
export const sqlite = new SQL("sqlite://../chat.db");
export async function init() {
  await sqlite`CREATE TABLE IF NOT EXISTS sessions (
    id TEXT NOT NULL PRIMARY KEY,
    secret BLOB NOT NULL,
    username TEXT NOT NULL,
    since INTEGER NOT NULL,
    until INTEGER NOT NULL,
    permission INTEGER NOT NULL
  ) STRICT;`;
  await sqlite`CREATE TABLE IF NOT EXISTS users (
    name TEXT NOT NULL PRIMARY KEY,
    permission INTEGER NOT NULL,
    password TEXT NOT NULL
  ) STRICT;`;
  await sqlite`CREATE TABLE IF NOT EXISTS messages (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    permission INTEGER NOT NULL,
    content TEXT NOT NULL,
    at INTEGER NOT NULL
  ) STRICT;`;
}
