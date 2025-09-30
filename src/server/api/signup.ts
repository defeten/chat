import { sid_cookie } from "@/server/auth/cookie";
import { createSession } from "@/server/auth/create";
import { USERNAME_REGEX } from "@/server/const";
import { getUser, insertUser } from "@/server/data/users";
import type { BackendUser } from "@/types";

export async function signup(req: Bun.BunRequest<"/signup">) {
  const data = await req.formData();
  const name = data.get("name")?.toString();
  const password = data.get("password")?.toString();
  const confirmation = data.get("confirmation")?.toString();
  if (!name || !password || !confirmation) {
    return new Response(null, { status: 400 });
  }

  if (name.charAt(0) === "_") {
    return new Response("username cannot start with an underscore", {
      status: 400,
    });
  }
  if (!USERNAME_REGEX.test(name)) {
    return new Response(
      "username must be 4-24 characters, including only numbers, letters, or underscores",
      { status: 400 },
    );
  }

  if (password.length > 64 || password.length < 8) {
    return new Response("password must be 8-64 characters", { status: 400 });
  }

  if (password !== confirmation) {
    return new Response("passwords must match", { status: 400 });
  }

  const existingUser = await getUser(name);
  if (existingUser) {
    return new Response("name taken", { status: 400 });
  }

  const passwordHash = await Bun.password.hash(password);
  const user: BackendUser = {
    name,
    passwordHash: passwordHash,
    permission: 0,
  };

  await insertUser(user);
  const session = await createSession(name, 0);
  const cookie = sid_cookie(session.token);

  req.cookies.set(cookie);
  return new Response(null);
}
