import { type ReactNode, useContext } from "react";
import { Author } from "./author";
import { Emote } from "./emote";
import { Link } from "./link";
import clsx from "clsx";
import { IdentityContext } from "@/client/context/IdentityContext";
import { Time } from "@/client/components/messages/time";
import emotes from "@/client/emotes.json";
import { URL_REGEX } from "@/client/util/regex";
import type { UMSG } from "@/types";

interface Props {
  data: UMSG;
  _continue?: boolean;
}

function mergeStrings(nodes: ReactNode[]): ReactNode[] {
  return nodes.reduce<ReactNode[]>((acc, node) => {
    if (typeof node === "string") {
      if (typeof acc[acc.length - 1] === "string") {
        acc[acc.length - 1] = (acc[acc.length - 1] as string) + " " + node;
      } else {
        acc.push(node);
      }
    } else {
      acc.push(node);
    }
    return acc;
  }, []);
}

export function UserMessage({ data, _continue }: Props) {
  const me = useContext(IdentityContext);
  let mentionsMe = false;
  if (me?.name) {
    mentionsMe = new RegExp(me.name, "gi").test(data.content);
  }

  const content: ReactNode[] = data.content.split(" ").map((node, idx) => {
    if (typeof node === "string") {
      if (URL_REGEX.test(node)) {
        let href = node;
        if (href.substring(0, 4) !== "http") {
          href = "https://" + href;
        }
        return <Link key={`${data.id}:link${idx}`} href={node} />;
      } else if (emotes.includes(node)) {
        return <Emote key={`${data.id}:${node}:${idx}`} name={node} />;
      } else return node + " ";
    } else return node;
  });

  return (
    <div
      data-id={data.id}
      className={clsx({ "mb-[0.5px] rounded-xs bg-cyan-700/50": mentionsMe })}
    >
      <Time timestamp={data.at} />
      {!_continue && (
        <Author data={{ name: data.name, permission: data.permission }} />
      )}
      <span className={clsx("mr-1", { "text-stone-600": _continue })}>
        {_continue ? ">" : ":"}
      </span>
      <span className="relative h-6">{mergeStrings(content)}</span>
    </div>
  );
}
