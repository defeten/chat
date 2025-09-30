import { History } from "@/index";
import type { Message, Session, UMSG } from "@/types";
import { UserMessageEvent } from "@/server/socket/event";
import { broadcast } from "@/server/socket/send";
import { id } from "@/server/util";

export function message(
  socket: Bun.ServerWebSocket<Session>,
  message: string | Buffer<ArrayBufferLike>
) {
  const now = Date.now();
  if (typeof message !== "string") {
    return;
  }

  const msg: Message = JSON.parse(message);
  if (msg.type === "clientUMSG") {
    if (msg.data.content === "") {
      return;
    }

    const d: UMSG = {
      id: id(),
      at: now,
      content: msg.data.content,
      name: socket.data.username,
      permission: socket.data.permission,
    };
    if (History.length === 200) {
      History.shift();
    }
    History.push(d);
    // Standard user message, send to all clients
    broadcast(new UserMessageEvent(d));
  }
}
