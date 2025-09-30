import { deleteSession } from "../data/sessions";

export async function signout(req: Bun.BunRequest<"/signout">) {
  const sid = req.cookies.get("sid");
  if (!sid) {
    return new Response();
  }

  req.cookies.delete("sid");
  const [id] = sid.split(".");
  if (id) {
    await deleteSession(id);
  }

  return new Response();
}
