import { type BunRequest, serve } from "bun";
import index from "@/client/index.html";
import { check } from "@/server/api/check";
import { me } from "@/server/api/me";
import { signin } from "@/server/api/signin";
import { signout } from "@/server/api/signout";
import { signup } from "@/server/api/signup";
import { verify } from "@/server/auth/verify";
import { init } from "@/server/data/init";
import { close } from "@/server/socket/close";
import { message } from "@/server/socket/message";
import { open } from "@/server/socket/open";
import type { ConnectionsMap, Session, UMSG } from "@/types";

await init();
export const Connections: ConnectionsMap = new Map();
export const History = new Array<UMSG>();

const server = serve<Session, {}>({
  port: 5001,
  routes: {
    "/api/me": me,
    "/api/signup": {
      POST: signup,
    },
    "/api/check": check,
    "/api/signin": {
      POST: signin,
    },
    "/api/signout": signout,
    "/": index,
  },
  async fetch(req, server) {
    const url = new URL(req.url);
    if (url.pathname === "/ws") {
      const result = await verify(req);
      if (!result.ok) {
        return new Response(result.error, { status: 401 });
      }

      if (server.upgrade(req, { data: result.session })) {
        return;
      }
      return new Response(null, { status: 400 });
    }
    return new Response("not found", { status: 404 });
  },
  websocket: {
    open,
    message,
    close,
  },
  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`-> ${server.url}`);
