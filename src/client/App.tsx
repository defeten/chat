import { useCallback, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useSocketMessages } from "@/client/hooks/useMessages";
import { useSocket } from "@/client/hooks/useSocket";
import { IdentityContext } from "@/client/context/IdentityContext";
import { NoIdentity } from "@/client/components/auth/no-identity";
import { Footer } from "@/client/components/footer";
import { Settings } from "@/client/components/settings";
import { UserList } from "@/client/components/users";
import { Chat } from "@/client/Chat";
import { clientUserMessageEvent } from "@/server/socket/event";
import type { AppView } from "@/types";

export default function App() {
  const socket = useSocket();
  const { me, msgs, users } = useSocketMessages(socket);
  const [input, setInput] = useState("");
  const [view, setView] = useState<AppView>("chat");

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
        {view === "chat" && (
          <Chat
            msgs={msgs}
            input={input}
            send={send}
            setInput={setInput}
            users={users}
          />
        )}
        {view === "users" && <UserList users={users} />}
        {view === "settings" && <Settings />}
      </div>
      <Footer view={view} setView={setView} />
    </IdentityContext.Provider>
  );
}
