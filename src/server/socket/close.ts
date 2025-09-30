import { Connections } from "@/index";
import type { Session } from "@/types";
import { UserLeaveEvent } from "@/server/socket/event";
import { broadcast } from "@/server/socket/send";
import { id } from "@/server/util";

export function close(socket: Bun.ServerWebSocket<Session>) {
  const now = Date.now();

  const userSockets = Connections.get(socket.data.username);
  if (!userSockets) {
    socket.terminate();
    return;
  }

  const remainingUserSockets = userSockets.filter(
    (s) => s.data.id !== socket.data.id
  );

  if (remainingUserSockets.length === 0) {
    Connections.delete(socket.data.username);
    broadcast(
      new UserLeaveEvent({ at: now, id: id(), name: socket.data.username })
    );
  } else {
    Connections.set(socket.data.username, remainingUserSockets);
  }
}
