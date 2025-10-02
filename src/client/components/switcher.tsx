import type { Dispatch, SetStateAction } from "react";
import { ChatBubbleIcon, GearIcon, PersonIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { ToggleGroup } from "radix-ui";
import { tw } from "@/client/util/tw";
import type { AppView } from "@/types";

type Props = {
  view: AppView;
  setView: Dispatch<SetStateAction<AppView>>;
};

const toggleGroupItemClasses = tw`rounded-full py-1.5 px-2 cursor-pointer z-10`;
const toggledItemClass = tw`text-emerald-400`;

export function Switcher({ view, setView }: Props) {
  const highlight = clsx(
    tw`absolute top-0 left-0 h-full w-[33%] rounded-xl pointer-events-none transform transition-all duration-300 ease-in-out bg-stone-700 blur-sm`,
    {
      "translate-x-0": view === "chat",
      "translate-x-[100%]": view === "settings",
      "translate-x-[200%]": view === "users",
    },
  );

  return (
    <ToggleGroup.Root
      data-orientation="horizontal"
      type="single"
      value={view}
      onValueChange={(value) => setView(value as AppView)}
      aria-label="Main view"
      className="relative inline-flex w-min rounded-full"
    >
      <div className={highlight} />
      <ToggleGroup.Item
        value="chat"
        className={clsx([
          toggleGroupItemClasses,
          view === "chat" && toggledItemClass,
        ])}
      >
        <ChatBubbleIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        value="settings"
        className={clsx([
          toggleGroupItemClasses,
          view === "settings" && toggledItemClass,
        ])}
      >
        <GearIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        value="users"
        className={clsx([
          toggleGroupItemClasses,
          view === "users" && toggledItemClass,
        ])}
      >
        <PersonIcon />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}
