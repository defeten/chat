import { sid_cookie } from "../auth/cookie";
import { createSession } from "../auth/create";
import { getUser } from "../data/users";

export async function signin(req: Bun.BunRequest<"/signin">) {
  const data = await req.formData();
  const username = data.get("name")?.toString();
  const password = data.get("password")?.toString();

  if (!username || !password) {
    return new Response("form incomplete", { status: 400 });
  }

  const user = await getUser(username);
  if (!user) {
    return new Response("account not found", { status: 400 });
  }

  const validPassword = await Bun.password.verify(password, user.passwordHash);
  if (!validPassword) {
    return new Response("password incorrect", { status: 401 });
  }

  const session = await createSession(username, user.permission);
  const sid = sid_cookie(session.token);
  req.cookies.set(sid);

  return new Response();
}
