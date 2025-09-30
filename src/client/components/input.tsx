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
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { IdentityContext } from "@/client/context/IdentityContext";
import emotes from "@/client/emotes.json";
import type { UnfocusInputAfterSend, User } from "@/types";

const bucket = new Fuse([...emotes]);

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
  const textarea = useRef<HTMLTextAreaElement>(null);
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
      bucket.add(user.name);
    });

    return () => {
      users.forEach((user) => {
        bucket.remove((predicate) => user.name === predicate);
      });
    };
  }, [users]);

  const handleTabDown = useCallback(
    (selectionOverride?: number) => {
      if (!textarea.current) return;

      if (results.length > 0) {
        const cursorPosition = textarea.current.selectionStart;
        const { value } = textarea.current;
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
        const replacement = results[selectionOverride ?? nextSelection]!.item;

        setInput(
          (current) =>
            current.slice(0, start) + replacement + current.slice(end),
        );

        requestAnimationFrame(() => {
          if (textarea.current) {
            textarea.current.selectionStart = textarea.current.selectionEnd =
              start + replacement.length;
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
    if (!textarea.current) return;

    const cursorPosition = textarea.current.selectionStart;
    const { value } = textarea.current;

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

  return (
    <div className="relative">
      {results.length > 0 && (
        <div className="absolute z-10 -mt-10 max-w-[calc(100%-0.5rem)] gap-x-2 overflow-hidden rounded-sm bg-stone-700 p-1 text-stone-400">
          <OverlayScrollbarsComponent
            element="div"
            options={{
              scrollbars: { theme: "os-theme-light" },
              overflow: {
                x: "scroll",
                y: "hidden",
              },
            }}
            className="w-full"
          >
            {results.map((r, index) => (
              <span
                key={index}
                onClick={() => {
                  handleTabDown(index);
                  textarea.current?.focus();
                }}
                className={clsx("mr-1 cursor-pointer", {
                  "font-semibold":
                    selection === -1
                      ? index === 0
                        ? true
                        : false
                      : selection === index,
                })}
              >
                {r.item}
              </span>
            ))}
          </OverlayScrollbarsComponent>
        </div>
      )}

      <textarea
        id="input"
        ref={textarea}
        placeholder={
          me
            ? `Hi ${me.name}, talk with ${users.length - 1} other chatter${
                users.length - 1 === 1 ? "" : "s"
              }.`
            : "Authenticate to send messages."
        }
        className="min-h-16 w-full resize-none rounded-md border-2 border-stone-600 p-2 transition-colors outline-none focus:border-stone-400"
        value={input}
        onChange={({ target }) => {
          setInput(target.value);
          updateSearchTerm();
        }}
        onKeyDown={(event) => {
          if (!textarea.current) return;
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
              textarea.current.blur();
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
