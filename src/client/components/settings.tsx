import { useLocalStorage } from "@uidotdev/usehooks";
import type {
  LinkBehavior,
  MaxLinkLength,
  UnfocusInputAfterSend,
} from "@/types";

export function Settings() {
  const [time, setTime] = useLocalStorage("pref:showtime", false);
  const [scrollBehavior, setScrollBehavior] = useLocalStorage<ScrollBehavior>(
    "pref:scrollbehavior",
    "instant",
  );
  const [maxLinkLength, setMaxLinkLength] = useLocalStorage<MaxLinkLength>(
    "pref:maxlinklength",
    80,
  );
  const [linkBehavior, setLinkBehavior] = useLocalStorage<LinkBehavior>(
    "pref:linkbehavior",
    "newtab",
  );
  const [unfocusInput, setUnfocusInput] =
    useLocalStorage<UnfocusInputAfterSend>("pref:unfocusaftersend", false);

  return (
    <div className="mx-auto my-auto grid grid-cols-2 justify-center rounded-md bg-stone-700 p-2 text-stone-300">
      <p className="col-span-2 mx-auto text-center text-lg font-bold">
        Preferences
      </p>
      <label className="text-sm font-semibold" htmlFor="showtime">
        Show time labels
      </label>
      <input
        id="showtime"
        type="checkbox"
        className="mr-auto"
        checked={time}
        onChange={({ target }) => setTime(target.checked)}
      />
      <label className="text-sm font-semibold" htmlFor="scrollbehavior">
        Scroll behavior
      </label>
      <select
        id="scrollbehavior"
        className="outline-none"
        value={scrollBehavior}
        onChange={({ target }) =>
          setScrollBehavior(target.value as ScrollBehavior)
        }
      >
        <option value={"instant" satisfies ScrollBehavior}>instant</option>
        <option value={"smooth" satisfies ScrollBehavior}>smooth</option>
      </select>
      <label className="text-sm font-semibold" htmlFor="maxlinklength">
        Max link length
      </label>
      <input
        type="number"
        min={30}
        id="maxlinklength"
        className="leading-3 outline-none"
        value={maxLinkLength}
        onChange={({ target }) => setMaxLinkLength(Number(target.value))}
      />
      <label className="text-sm font-semibold" htmlFor="linkbehavior">
        Link behavior
      </label>
      <select
        id="linkbehavior"
        className="outline-none"
        value={linkBehavior}
        onChange={({ target }) => setLinkBehavior(target.value as LinkBehavior)}
      >
        <option value={"newtab" satisfies LinkBehavior}>newtab</option>
        <option value={"copy" satisfies LinkBehavior}>copy</option>
      </select>
      <label className="text-sm font-semibold" htmlFor="unfocusaftersend">
        Sending closes keyboard
      </label>
      <input
        type="checkbox"
        id="unfocusaftersend"
        className="mr-auto"
        checked={unfocusInput}
        onChange={({ target }) => setUnfocusInput(target.checked)}
      />
    </div>
  );
}
