import { useLocalStorage } from "@uidotdev/usehooks";
import clsx from "clsx";

interface Props {
  timestamp: number;
}

export function Time({ timestamp }: Props) {
  const [show] = useLocalStorage("pref:showtime", false);
  const date = new Date(timestamp);

  return (
    <time
      className={clsx("text-xs text-stone-500 mr-2", { hidden: !show })}
      dateTime={date.toISOString()}
    >
      {date.toLocaleTimeString(undefined, {
        hourCycle: "h23",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </time>
  );
}
