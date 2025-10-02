import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import clsx from "clsx";
import Fuse from "fuse.js";
import { ScrollArea } from "radix-ui";
import { IdentityContext } from "@/client/context/IdentityContext";
import { Emote } from "@/client/components/messages/emote";
import emotes from "@/client/emotes.json";
import type { UnfocusInputAfterSend, User } from "@/types";

const bucket = new Fuse(
  [...emotes].map((e) => ({ type: "emote", name: e })),
  { keys: ["name"] },
);

type Props = {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  users: User[];
  send: (m: string) => void;
};

export function Input({ input, setInput, send, users }: Props) {
  const me = useContext(IdentityContext);
  const [selection, setSelection] = useState(-1);
  const [searchTerm, setSearchTerm] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const ignoreSelectChange = useRef(false);
  const [unfocusInput] = useLocalStorage<UnfocusInputAfterSend>(
    "pref:unfocusaftersend",
    false,
  );

  const results = useMemo(() => {
    if (searchTerm === "") {
      return [];
    }
    return bucket.search(searchTerm) ?? [];
  }, [searchTerm]);

  useEffect(() => {
    users.forEach((user) => {
      if (user.name !== me?.name) {
        bucket.add({ type: "user", name: user.name });
      }
    });

    return () => {
      users.forEach((user) => {
        bucket.remove(
          (predicate) =>
            predicate.type === "user" && user.name === predicate.name,
        );
      });
    };
  }, [users]);

  const handleTabDown = useCallback(
    (selectionOverride?: number) => {
      if (!textareaRef.current) return;

      if (results.length > 0) {
        const cursorPosition = textareaRef.current.selectionStart;
        const { value } = textareaRef.current;
        ignoreSelectChange.current = true;

        const before = value.slice(0, cursorPosition);
        const after = value.slice(cursorPosition);

        const leftMatch = before.match(/\b(\w+)$/);
        const leftWord = leftMatch ? leftMatch[1] : "";
        const rightMatch = after.match(/^\b(\w+)\b/);
        const rightWord = rightMatch ? rightMatch[1] : "";

        let start = cursorPosition;
        let end = cursorPosition;

        if (leftWord) start = cursorPosition - leftWord.length;
        if (rightWord) end = cursorPosition + rightWord.length;

        let nextSelection = selection + 1;
        if (nextSelection >= results.length) {
          nextSelection = 0;
        }
        const replacement =
          results[selectionOverride ?? nextSelection]!.item.name;

        setInput(
          (current) =>
            current.slice(0, start) + replacement + current.slice(end),
        );

        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart =
              textareaRef.current.selectionEnd = start + replacement.length;
          }
        });

        if (!selectionOverride) {
          setSelection((current) => {
            if (current >= results.length - 1) {
              return 0;
            } else return current + 1;
          });
        } else setSelection(selectionOverride);
      }
    },
    [selection, results],
  );

  const updateSearchTerm = useCallback(() => {
    if (!textareaRef.current) return;

    const cursorPosition = textareaRef.current.selectionStart;
    const { value } = textareaRef.current;

    const before = value.slice(0, cursorPosition);
    const after = value.slice(cursorPosition);
    const leftMatch = before.match(/\b(\w+)$/);
    const leftWord = leftMatch ? leftMatch[1] : "";
    const rightMatch = after.match(/^\b(\w+)\b/);
    const rightWord = rightMatch ? rightMatch[1] : "";

    if (leftWord && rightWord) {
      setSearchTerm(leftWord + rightWord);
    } else if (leftWord && !rightWord) {
      setSearchTerm(leftWord);
    } else if (!leftWord && rightWord) {
      setSearchTerm(rightWord);
    } else {
      setSearchTerm(value.split(" ").slice(-1)[0] ?? "");
    }
    setSelection(-1);
  }, []);

  useEffect(() => {
    if (!scrollViewportRef.current || results.length === 0) return;

    const viewport = scrollViewportRef.current;
    const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;

    const scrollPercent = selection / (results.length - 1);
    const scrollLeft = maxScrollLeft * scrollPercent;

    viewport.scrollTo({
      left: scrollLeft,
      behavior: "smooth",
    });
  }, [selection, results]);

  return (
    <div className="relative">
      {results.length > 0 && (
        <ScrollArea.Root className="absolute z-10 mb-1 max-w-full overflow-hidden rounded-sm bg-stone-700/50 text-stone-400">
          <ScrollArea.Viewport
            ref={scrollViewportRef}
            className="flex max-w-full gap-x-1 pb-0.5 whitespace-nowrap"
          >
            {results.map((r, index) => {
              const isSelected =
                selection === -1 ? index === 0 : selection === index;

              if (r.item.type === "emote") {
                return (
                  <span
                    key={index}
                    onClick={() => {
                      handleTabDown(index);
                      textareaRef.current?.focus();
                    }}
                    className={clsx(
                      "mr-1 -mb-2 cursor-pointer [&>span]:-mb-0.5",
                      {
                        "[&>span]:opacity-25 [&>span]:grayscale": !isSelected,
                      },
                    )}
                  >
                    <Emote name={r.item.name} />
                  </span>
                );
              }
              return (
                <span
                  key={index}
                  onClick={() => {
                    handleTabDown(index);
                    textareaRef.current?.focus();
                  }}
                  className={clsx("mr-1 cursor-pointer", {
                    "font-semibold text-emerald-300":
                      selection === -1 ? index === 0 : selection === index,
                  })}
                >
                  {r.item.name}
                </span>
              );
            })}
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="horizontal">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      )}

      <textarea
        id="input"
        ref={textareaRef}
        placeholder={
          me ? `Write a message, ${me.name}!` : "Authenticate to send messages."
        }
        className="min-h-16 w-full resize-none rounded-md border-2 border-stone-600 p-2 transition-colors outline-none focus:border-stone-400"
        value={input}
        onChange={({ target }) => {
          setInput(target.value);
          updateSearchTerm();
        }}
        onKeyDown={(event) => {
          if (!textareaRef.current) return;
          const { key } = event;

          if (key === "Tab") {
            event.preventDefault();
            handleTabDown();
          } else if (key === "Enter") {
            event.preventDefault();
            ignoreSelectChange.current = false;
            const m = input.trim();
            setInput("");
            if (unfocusInput) {
              textareaRef.current.blur();
            }
            if (m !== "") {
              send(m);
            }
            setSelection(-1);
          } else if (key === " ") {
            ignoreSelectChange.current = false;
            setSearchTerm("");
            setSelection(-1);
          } else if (key === "Backspace") {
            ignoreSelectChange.current = false;
            setSelection(-1);
          }
        }}
        onSelect={() => {
          if (ignoreSelectChange.current) return;
          updateSearchTerm();
        }}
      />
    </div>
  );
}
