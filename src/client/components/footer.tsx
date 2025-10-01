import type { Dispatch, SetStateAction } from "react";
import { Switcher } from "../Switcher";
import { ExitIcon } from "@radix-ui/react-icons";
import { Separator } from "radix-ui";
import type { AppView } from "@/types";

type Props = {
  view: AppView;
  setView: Dispatch<SetStateAction<AppView>>;
};

export function Footer({ view, setView }: Props) {
  return (
    <div className="mx-auto inline-flex w-min items-center justify-center rounded-full bg-stone-800 md:mx-0 md:w-full">
      <Switcher view={view} setView={setView} />
      <Separator.Root
        className="mx-2 h-4 w-px bg-stone-700 md:mx-0 md:w-0 md:grow md:bg-transparent"
        decorative
      />
      <button
        title="Sign out"
        type="button"
        className="cursor-pointer px-2"
        onClick={() => {
          fetch("/api/signout").then(() => window.location.reload());
        }}
      >
        <ExitIcon className="text-red-700" />
      </button>
    </div>
  );
}
