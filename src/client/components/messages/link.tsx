import type { LinkBehavior } from "@/types";
import { useLocalStorage } from "@uidotdev/usehooks";

type Props = {
  href: string;
};

export function Link({ href }: Props) {
  const [maxLinkLength] = useLocalStorage("pref:maxlinklength", 80);
  const [linkbehavior] = useLocalStorage<LinkBehavior>(
    "pref:linkbehavior",
    "newtab"
  );

  let visible = href;
  if (visible.length > maxLinkLength) {
    visible = `${visible.slice(0, maxLinkLength / 2 - 3)} .. ${visible.slice(
      -(maxLinkLength / 2)
    )}`;
  }

  if (linkbehavior === "newtab") {
    return (
      <a target="_blank" className="text-blue-400 cursor-pointer" href={href}>
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
      className="text-blue-400 cursor-copy"
      href={href}
    >
      {visible}{" "}
    </a>
  );
}
