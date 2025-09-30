import { IoChatbox, IoHappy, IoPerson, IoSettings } from "react-icons/io5";
import { SignOut } from "./components/auth/sign-out";
import { Button } from "./components/ui/button";
import type { MainContext } from "@/types";
import type { SetStateAction, Dispatch } from "react";
import clsx from "clsx";

type Props = {
  context: MainContext;
  setContext: Dispatch<SetStateAction<MainContext>>;
};

export function Switcher({ context, setContext }: Props) {
  return (
    <div className="flex items-center justify-center lg:justify-start gap-x-2 -mb-2">
      <Button
        theme="dark"
        onClick={() => setContext("chat")}
        className={clsx({ "bg-stone-600": context === "chat" })}
      >
        <IoChatbox className="w-6 h-6 fill-stone-400" />
      </Button>
      <Button
        onClick={() => setContext("emotes")}
        theme="dark"
        className={clsx({ "bg-stone-600": context === "emotes" })}
      >
        <IoHappy className="w-6 h-6 fill-stone-400" />
      </Button>
      <Button
        theme="dark"
        onClick={() => setContext("users")}
        className={clsx({ "bg-stone-600": context === "users" })}
      >
        <IoPerson className="w-6 h-6 fill-stone-400" />
      </Button>
      <Button
        theme="dark"
        onClick={() => setContext("settings")}
        className={clsx({ "bg-stone-600": context === "settings" })}
      >
        <IoSettings className="w-6 h-6 fill-stone-400" />
      </Button>
      <span className="lg:ml-auto">
        <SignOut />
      </span>
    </div>
  );
}
