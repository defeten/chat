import type { LEAVE } from "@/types";
import { Time } from "./time";

type Props = {
  data: LEAVE;
};

export function UserLeave({ data }: Props) {
  return (
    <div>
      <Time timestamp={data.at} />
      <span className="font-semibold text-red-600 mr-1">-</span>
      <span className="text-stone-500">{data.name}</span>
    </div>
  );
}
