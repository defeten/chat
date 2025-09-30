import { id } from "../util";
import {
  HistoryEvent,
  IdentityEvent,
  UserJoinEvent,
  UsersEvent,
} from "./event";
import { broadcast, emitToSocket } from "./send";
import { Connections, History } from "@/index";
import type { Session, UserSockets } from "@/types";

export function open(socket: Bun.ServerWebSocket<Session>) {
  const now = Date.now();

  // get all connections from the same account
  let existing: UserSockets = [];
  if (Connections.has(socket.data.username)) {
    existing = Connections.get(socket.data.username)!;
  }

  if (existing.length === 0) {
    // if the account is not connected elsewhere, tell the chat someone joined
    broadcast(
      new UserJoinEvent({
        name: socket.data.username,
        permission: socket.data.permission,
        at: now,
        id: id(),
      }),
    );
  }

  // add the connection to the user's connections
  Connections.set(socket.data.username, [...existing, socket]);
  // tell the connection that account they're signed in as
  emitToSocket(
    socket,
    new IdentityEvent({
      name: socket.data.username,
      permission: socket.data.permission,
      id: id(),
    }),
  );
  // tell the connection who all is connected
  emitToSocket(
    socket,
    new UsersEvent({
      // only use the data from the first socket per account (should be the same)
      users: Connections.values()
        .map((sockets) => ({
          name: sockets[0]!.data.username,
          permission: sockets[0]!.data.permission,
        }))
        .toArray(),
      id: id(),
      at: now,
    }),
  );
  // send the connection the latest 200 messages
  emitToSocket(
    socket,
    new HistoryEvent({
      messages: History,
      at: now,
      id: id(),
    }),
  );
}
