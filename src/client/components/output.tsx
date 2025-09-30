import {
  OverlayScrollbarsComponent,
  type OverlayScrollbarsComponentRef,
} from "overlayscrollbars-react";
import type { RenderableMessage } from "@/types";
import { MessageRenderer } from "@/client/components/messages/render-message";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";

type Props = {
  renderable: RenderableMessage[];
};

export function Output({ renderable }: Props) {
  const [scrollBehavior] = useLocalStorage<"smooth" | "instant">(
    "pref:scrollbehavior",
    "instant"
  );
  const osRef = useRef<OverlayScrollbarsComponentRef<"div">>(null);
  const [scrollLock, setScrollLock] = useState(true);
  const BOTTOM_THRESHOLD = 6;

  const scrollToBottom = useCallback(() => {
    const osInstance = osRef.current?.osInstance();
    if (osInstance) {
      const { viewport } = osInstance.elements();
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: scrollBehavior,
      });
    }
  }, [scrollBehavior]);

  const handleScroll = useCallback(() => {
    const osInstance = osRef.current?.osInstance();
    if (!osInstance) return;

    const { viewport } = osInstance.elements();
    const { scrollTop, scrollHeight, clientHeight } = viewport;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    const atBottom = distanceFromBottom <= BOTTOM_THRESHOLD;

    setScrollLock(atBottom);
  }, []);

  const handleUpdated = useCallback(() => {
    if (scrollLock) {
      scrollToBottom();
    }
  }, [scrollLock, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <>
      <OverlayScrollbarsComponent
        ref={osRef}
        element="div"
        options={{
          scrollbars: { theme: "os-theme-light", autoHide: "scroll" },
        }}
        className="grow"
        events={{
          initialized: scrollToBottom,
          scroll: handleScroll,
          updated: handleUpdated,
        }}
      >
        {renderable.map((message) => {
          return <MessageRenderer key={message.data.id} message={message} />;
        })}
        <div className="pointer-events-none sticky bottom-0 z-10 h-2 w-full bg-linear-to-t from-stone-900 to-transparent" />
      </OverlayScrollbarsComponent>
      <div className="absolute top-2 right-2 text-xs">
        {scrollLock ? "🔒" : "🔓"}
        {scrollBehavior === "instant" ? "⚡" : "🪶"}
      </div>
    </>
  );
}
