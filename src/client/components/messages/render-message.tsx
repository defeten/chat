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
    case "SEPARATOR": {
      return (
        <div className="relative mb-px flex h-6 w-full items-center justify-center overflow-hidden">
          <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-md bg-red-900"></div>
          <span className="z-10 bg-stone-900 px-2 text-red-900">
            {new Date(message.data.at).toLocaleString(undefined, {
              hourCycle: "h23",
              dateStyle: "short",
              timeStyle: "short",
            })}
          </span>
        </div>
      );
    }
  }
});
