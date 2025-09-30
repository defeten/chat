import { SignOut } from "./components/auth/sign-out";
import { Button } from "./components/ui/button";
import clsx from "clsx";
import type { Dispatch, SetStateAction } from "react";
import { IoChatbox, IoHappy, IoPerson, IoSettings } from "react-icons/io5";
import type { MainContext } from "@/types";

type Props = {
  context: MainContext;
  setContext: Dispatch<SetStateAction<MainContext>>;
};

export function Switcher({ context, setContext }: Props) {
  return (
    <div className="-mb-2 flex items-center justify-center gap-x-2 lg:justify-start">
      <Button
        theme="dark"
        onClick={() => setContext("chat")}
        className={clsx({ "bg-stone-600": context === "chat" })}
      >
        <IoChatbox className="h-6 w-6 fill-stone-400" />
      </Button>
      <Button
        onClick={() => setContext("emotes")}
        theme="dark"
        className={clsx({ "bg-stone-600": context === "emotes" })}
      >
        <IoHappy className="h-6 w-6 fill-stone-400" />
      </Button>
      <Button
        theme="dark"
        onClick={() => setContext("users")}
        className={clsx({ "bg-stone-600": context === "users" })}
      >
        <IoPerson className="h-6 w-6 fill-stone-400" />
      </Button>
      <Button
        theme="dark"
        onClick={() => setContext("settings")}
        className={clsx({ "bg-stone-600": context === "settings" })}
      >
        <IoSettings className="h-6 w-6 fill-stone-400" />
      </Button>
      <span className="lg:ml-auto">
        <SignOut />
      </span>
    </div>
  );
}
