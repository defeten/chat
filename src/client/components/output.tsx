import { useCallback, useEffect, useRef, useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { ScrollArea } from "radix-ui";
import { MessageRenderer } from "@/client/components/messages/render-message";
import type { RenderableMessage } from "@/types";

type Props = {
  renderable: RenderableMessage[];
};

export function Output({ renderable }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scrollBehavior] = useLocalStorage<ScrollBehavior>(
    "pref:scrollbehavior",
    "instant",
  );
  const [scrollLock, setScrollLock] = useState(true);
  const BOTTOM_THRESHOLD = 6;

  const scrollToBottom = useCallback(() => {
    if (!viewportRef.current) return;

    viewportRef.current.scrollTo({
      top: viewportRef.current.scrollHeight,
      behavior: scrollBehavior,
    });
  }, [scrollBehavior]);

  const handleScroll = useCallback(() => {
    if (!viewportRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    const atBottom = distanceFromBottom <= BOTTOM_THRESHOLD;

    setScrollLock(atBottom);
  }, []);

  useEffect(() => {
    if (scrollLock) {
      scrollToBottom();
    }
  }, [renderable]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <ScrollArea.Root className="relative h-0 grow">
      <ScrollArea.Viewport
        onScroll={handleScroll}
        ref={viewportRef}
        className="h-full shrink"
      >
        {renderable.map((message) => {
          return <MessageRenderer key={message.data.id} message={message} />;
        })}
        <div className="pointer-events-none absolute bottom-0 z-10 h-2 w-full bg-linear-to-t from-stone-900 to-transparent" />
      </ScrollArea.Viewport>
      <div className="absolute top-2 right-2 text-xs">
        {scrollLock ? "🔒" : "🔓"}
        {scrollBehavior === "instant" ? "⚡" : "🪶"}
      </div>
      <ScrollArea.ScrollAreaScrollbar className="w-1 rounded-md bg-stone-700">
        <ScrollArea.Thumb className="w-full bg-stone-800" />
      </ScrollArea.ScrollAreaScrollbar>
    </ScrollArea.Root>
  );
}
