import { useEffect, useState } from "react";
import type { Message, RenderableMessage, User, YOUARE } from "@/types";
import toast from "react-hot-toast";

export function useSocketMessages(socket: WebSocket | null) {
  const [me, setMe] = useState<YOUARE | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [msgs, setMsgs] = useState<RenderableMessage[]>([]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.onmessage = ({ data }) => {
      const message: Message = JSON.parse(data);

      switch (message.type) {
        case "YOUARE": {
          setMe(message.data);
          break;
        }
        case "UMSG": {
          setMsgs((prev) => {
            const previous = prev[prev.length - 1];
            if (
              previous &&
              (previous.type === "UMSG" || previous.type === "UMSGC") &&
              previous.data.name === message.data.name
            ) {
              return [...prev, { type: "UMSGC", data: message.data }];
            } else {
              return [...prev, message];
            }
          });
          break;
        }
        case "JOIN": {
          toast(`${message.data.name} has joined.`);
          setUsers((current) => [
            ...current.filter((v) => v.name !== message.data.name),
            { name: message.data.name, permission: message.data.permission },
          ]);
          break;
        }
        case "LEAVE": {
          toast(`${message.data.name} has left.`);
          setUsers((current) =>
            current.filter((v) => v.name !== message.data.name)
          );
          break;
        }
        case "HISTORY": {
          let _his: RenderableMessage[] = [];
          message.data.messages.forEach((message, index, array) => {
            const previous = array[index - 1];
            if (previous && previous.name === message.name) {
              _his.push({ type: "UMSGC", data: message });
            } else {
              _his.push({ type: "UMSG", data: message });
            }
          });
          setMsgs(_his);
          break;
        }
        case "USERS": {
          setUsers(message.data.users);
          break;
        }
      }
    };

    return () => {
      socket.onmessage = null;
      setMsgs([]);
      setUsers([]);
      setMe(null);
    };
  }, [socket]);

  return { msgs, me, users };
}
