import type { Dispatch, SetStateAction } from "react";
import { ExitIcon } from "@radix-ui/react-icons";
import { useLocalStorage } from "@uidotdev/usehooks";
import clsx from "clsx";
import { Separator } from "radix-ui";
import { Switcher } from "@/client/components/switcher";
import type { AppView, FooterOffset } from "@/types";

type Props = {
  view: AppView;
  setView: Dispatch<SetStateAction<AppView>>;
};

export function Footer({ view, setView }: Props) {
  const [footerOffset] = useLocalStorage<FooterOffset>(
    "pref:footeroffset",
    true,
  );

  return (
    <div
      className={clsx(
        "mx-auto flex h-8 w-min shrink-0 items-center justify-center rounded-full bg-stone-800 md:mx-0 md:h-auto md:w-full",
        { "mb-8 md:mb-0": footerOffset },
      )}
    >
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
