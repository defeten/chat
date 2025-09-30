import { getUser } from "@/server/data/users";
import type { API_Check_Response } from "@/types";

export async function check(req: Bun.BunRequest<"/api/check">) {
  const name = new URL(req.url).searchParams.get("name");
  if (!name) {
    return new Response("expected a name (?name=...)", { status: 400 });
  }

  const user = await getUser(name, false);
  return Response.json({ exists: !!user } satisfies API_Check_Response);
}
