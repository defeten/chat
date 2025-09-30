import type { JOIN } from "@/types";
import { Time } from "./time";

type Props = {
  data: JOIN;
};

export function UserJoin({ data }: Props) {
  return (
    <div>
      <Time timestamp={data.at} />
      <span className="font-semibold text-emerald-600 mr-1">+</span>
      <span className="text-stone-500">{data.name}</span>
    </div>
  );
}
