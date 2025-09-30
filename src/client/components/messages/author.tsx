import { PERMISSION_NAMES } from "@/server/const";
import type { User } from "@/types";
import clsx from "clsx";

type Props = {
  data: User;
};

export function Author({ data }: Props) {
  return (
    <span
      data-level={PERMISSION_NAMES[data.permission]}
      className={clsx("font-bold", {
        "text-cyan-600": data.permission === 1,
        "text-fuchsia-600": data.permission === 2,
      })}
    >
      {data.name}
    </span>
  );
}
