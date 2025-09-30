import { useLocalStorage } from "@uidotdev/usehooks";
import type { LinkBehavior } from "@/types";

type Props = {
  href: string;
};

export function Link({ href }: Props) {
  const [maxLinkLength] = useLocalStorage("pref:maxlinklength", 80);
  const [linkbehavior] = useLocalStorage<LinkBehavior>(
    "pref:linkbehavior",
    "newtab",
  );

  let visible = href;
  if (visible.length > maxLinkLength) {
    visible = `${visible.slice(0, maxLinkLength / 2 - 3)} .. ${visible.slice(
      -(maxLinkLength / 2),
    )}`;
  }

  if (linkbehavior === "newtab") {
    return (
      <a target="_blank" className="cursor-pointer text-blue-400" href={href}>
        {visible}{" "}
      </a>
    );
  }

  return (
    <a
      onClick={(e) => {
        e.preventDefault();
        window.navigator.clipboard.writeText(href);
      }}
      className="cursor-copy text-blue-400"
      href={href}
    >
      {visible}{" "}
    </a>
  );
}
