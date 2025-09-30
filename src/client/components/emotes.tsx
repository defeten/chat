import { Emote } from "./messages/emote";
import emotes from "@/client/emotes.json";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

export function EmoteMenu() {
  return (
    <div className="m-auto flex max-w-lg flex-col items-start overflow-hidden rounded-md p-2 text-stone-300">
      <p className="w-full text-center font-semibold">Emotes</p>
      <OverlayScrollbarsComponent
        element="div"
        options={{ scrollbars: { theme: "os-theme-light" } }}
        className="mx-auto w-2/3 [&>[data-overlayscrollbars-contents]]:leading-10"
      >
        {emotes.map((emote) => (
          <span className="m-0.5">
            <Emote key={`emotelist:${emote}`} name={emote} />
          </span>
        ))}
      </OverlayScrollbarsComponent>
    </div>
  );
}
