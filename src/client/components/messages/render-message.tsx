import { memo } from "react";
import type { RenderableMessage } from "@/types";
import { UserMessage } from "@/client/components/messages/user-message";
import { UserJoin } from "./user-join";
import { UserLeave } from "./user-leave";

type Props = {
  message: RenderableMessage;
};

export const MessageRenderer = memo(({ message }: Props) => {
  switch (message.type) {
    case "HISTORY": {
      return message.data.messages.map((m, index, array) => {
        let _continue = false;
        if (index > 0 && array[index - 1]?.name === m.name) {
          _continue = true;
        }
        return <UserMessage key={m.id} data={m} _continue={_continue} />;
      });
    }
    case "UMSG": {
      return <UserMessage data={message.data} />;
    }
    case "UMSGC": {
      return <UserMessage data={message.data} _continue={true} />;
    }
    case "JOIN": {
      return <UserJoin data={message.data} />;
    }
    case "LEAVE": {
      return <UserLeave data={message.data} />;
    }
  }
});
