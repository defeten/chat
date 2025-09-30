import type { RenderableMessage, User } from "@/types";
import { Input } from "./components/input";
import { Output } from "./components/output";
import type { Dispatch, SetStateAction } from "react";

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
