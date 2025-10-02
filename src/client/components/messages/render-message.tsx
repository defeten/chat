import { memo } from "react";
import { UserMessage } from "@/client/components/messages/user-message";
import type { RenderableMessage } from "@/types";

type Props = {
  message: RenderableMessage;
};

export const MessageRenderer = memo(({ message }: Props) => {
  switch (message.type) {
    case "UMSG": {
      return <UserMessage data={message.data} />;
    }
    case "UMSGC": {
      return <UserMessage data={message.data} _continue={true} />;
    }
  }
});
