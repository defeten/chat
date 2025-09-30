import { verify } from "../auth/verify";
import type { User } from "@/types";

export async function me(req: Bun.BunRequest<"/me">) {
  const result = await verify(req);
  if (!result.ok) {
    return new Response(result.error, { status: 401 });
  }

  return Response.json({
    name: result.session.username,
    permission: result.session.permission,
  } satisfies User);
}
