import type { Dispatch, SetStateAction } from "react";
import { Input } from "@/client/components/input";
import { Output } from "@/client/components/output";
import type { RenderableMessage, User } from "@/types";

type Props = {
  msgs: RenderableMessage[];
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  send: (m: string) => void;
  users: User[];
};

export function Chat({ msgs, input, setInput, send, users }: Props) {
  return (
    <>
      <Output renderable={msgs} />
      <Input input={input} setInput={setInput} send={send} users={users} />
    </>
  );
}
