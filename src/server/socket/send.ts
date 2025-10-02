import { Connections } from "@/index";
import type { Event } from "@/server/socket/event";
import type { UserSockets } from "@/types";

export function emitToSocket(socket: UserSockets[number], event: Event) {
  socket.send(event.json());
}

export function emitToUser(sockets: UserSockets, event: Event) {
  sockets.forEach((socket) => socket.send(event.json()));
}

export function broadcast(event: Event, exclude?: string) {
  let pool = [...Connections.entries()];
  if (exclude) {
    pool = pool.filter(([id]) => id !== exclude);
  }
  pool.forEach(([, sockets]) => {
    sockets.forEach((socket) => socket.send(event.json()));
  });
}
