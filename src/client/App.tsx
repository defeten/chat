import { useCallback, useState } from "react";
import { useSocket } from "@/client/hooks/useSocket";
import { useSocketMessages } from "@/client/hooks/useMessages";
import { IdentityContext } from "@/client/context/IdentityContext";
import { NoIdentity } from "@/client/components/auth/no-identity";
import { EmoteMenu } from "@/client/components/emotes";
import { Switcher } from "@/client/Switcher";
import { Chat } from "@/client/Chat";
import type { MainContext } from "@/types";
import { Settings } from "@/client/components/settings";
import { UserList } from "@/client/components/users";
import { clientUserMessageEvent } from "@/server/socket/event";
import { Toaster } from "react-hot-toast";

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
    [socket]
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
      <div className="grow flex flex-col">
        {context === "chat" && (
          <Chat
            msgs={msgs}
            input={input}
            send={send}
            setInput={setInput}
            users={users}
          />
        )}
        {context === "emotes" && <EmoteMenu />}
        {context === "users" && <UserList users={users} />}
        {context === "settings" && <Settings />}
      </div>
      <Switcher context={context} setContext={setContext} />
    </IdentityContext.Provider>
  );
}
