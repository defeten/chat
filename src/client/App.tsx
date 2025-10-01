import { useCallback, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useSocketMessages } from "@/client/hooks/useMessages";
import { useSocket } from "@/client/hooks/useSocket";
import { IdentityContext } from "@/client/context/IdentityContext";
import { NoIdentity } from "@/client/components/auth/no-identity";
import { Settings } from "@/client/components/settings";
import { UserList } from "@/client/components/users";
import { Chat } from "@/client/Chat";
import { Switcher } from "@/client/Switcher";
import { clientUserMessageEvent } from "@/server/socket/event";
import type { MainContext } from "@/types";

export default function App() {
  const socket = useSocket();
  const { me, msgs, users } = useSocketMessages(socket);
  const [input, setInput] = useState("");
  const [context, setContext] = useState<MainContext>("chat");

  const send = useCallback(
    (data: string) => {
      if (!socket) {
        return;
      }
      socket.send(new clientUserMessageEvent({ content: data }).json());
    },
    [socket],
  );

  if (!socket) {
    return "Loading...";
  }

  if (!me) {
    return <NoIdentity />;
  }

  return (
    <IdentityContext.Provider value={me}>
      <Toaster position="top-right" />
      <div className="flex grow flex-col">
        {context === "chat" && (
          <Chat
            msgs={msgs}
            input={input}
            send={send}
            setInput={setInput}
            users={users}
          />
        )}
        {context === "users" && <UserList users={users} />}
        {context === "settings" && <Settings />}
      </div>
      <Switcher context={context} setContext={setContext} />
    </IdentityContext.Provider>
  );
}
