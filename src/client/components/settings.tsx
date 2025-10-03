import { useLocalStorage } from "@uidotdev/usehooks";
import { Switch } from "radix-ui";
import type {
  FooterOffset,
  LinkBehavior,
  MaxLinkLength,
  UnfocusInputAfterSend,
} from "@/types";

export function Settings() {
  const [showTime, setShowTime] = useLocalStorage("pref:showtime", false);
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
  const [footerOffset, setFooterOffset] = useLocalStorage<FooterOffset>(
    "pref:footeroffset",
    true,
  );

  return (
    <div className="mx-auto flex h-full w-full flex-col justify-center gap-y-4 rounded-md p-2 text-stone-300 md:w-1/2">
      <p className="mx-auto text-center text-lg font-bold">Preferences</p>
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold" htmlFor="showtime">
          Show time labels
        </label>
        <Switch.Root
          id="showtime"
          data-state={showTime ? "checked" : "unchecked"}
          onClick={() => setShowTime((current) => !current)}
          className="relative h-6 w-10 cursor-default rounded-full bg-stone-800 outline-none data-[state=checked]:bg-emerald-800"
        >
          <Switch.Thumb
            data-state={showTime ? "checked" : "unchecked"}
            className="shadow-blackA4 block size-5 translate-x-0.5 rounded-full bg-stone-400 transition-transform duration-200 will-change-transform data-[state=checked]:translate-x-4.5 data-[state=checked]:bg-stone-200"
          />
        </Switch.Root>
      </div>
      <div className="flex items-center justify-between">
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
      </div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold" htmlFor="maxlinklength">
          Max link length (chars)
        </label>
        <input
          type="text"
          min={30}
          id="maxlinklength"
          pattern="\d*"
          className="w-min border-b border-stone-200 leading-3 outline-none"
          value={maxLinkLength}
          onFocus={({ target }) => (target.value = "")}
          onBlur={({ target }) => {
            if (target.value == "") target.value = maxLinkLength.toString();
          }}
          onChange={({ target }) => setMaxLinkLength(Number(target.value))}
        />
      </div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold" htmlFor="linkbehavior">
          Link behavior
        </label>
        <select
          id="linkbehavior"
          className="outline-none"
          value={linkBehavior}
          onChange={({ target }) =>
            setLinkBehavior(target.value as LinkBehavior)
          }
        >
          <option value={"newtab" satisfies LinkBehavior}>newtab</option>
          <option value={"copy" satisfies LinkBehavior}>copy</option>
        </select>
      </div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold" htmlFor="unfocusaftersend">
          Sending closes keyboard
        </label>
        <Switch.Root
          id="unfocusaftersend"
          data-state={unfocusInput ? "checked" : "unchecked"}
          onClick={() => setUnfocusInput((current) => !current)}
          className="relative h-6 w-10 cursor-default rounded-full bg-stone-800 outline-none data-[state=checked]:bg-emerald-800"
        >
          <Switch.Thumb
            data-state={unfocusInput ? "checked" : "unchecked"}
            className="shadow-blackA4 block size-5 translate-x-0.5 rounded-full bg-stone-400 transition-transform duration-200 will-change-transform data-[state=checked]:translate-x-4.5 data-[state=checked]:bg-stone-200"
          />
        </Switch.Root>
      </div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold" htmlFor="footeroffset">
          Mobile footer offset
        </label>
        <Switch.Root
          id="footeroffset"
          data-state={footerOffset ? "checked" : "unchecked"}
          onClick={() => setFooterOffset((current) => !current)}
          className="relative h-6 w-10 cursor-default rounded-full bg-stone-800 outline-none data-[state=checked]:bg-emerald-800"
        >
          <Switch.Thumb
            data-state={footerOffset ? "checked" : "unchecked"}
            className="shadow-blackA4 block size-5 translate-x-0.5 rounded-full bg-stone-400 transition-transform duration-200 will-change-transform data-[state=checked]:translate-x-4.5 data-[state=checked]:bg-stone-200"
          />
        </Switch.Root>
      </div>
    </div>
  );
}
