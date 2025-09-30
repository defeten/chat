import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import emotes from "@/client/emotes.json";
import { Emote } from "./messages/emote";

export function EmoteMenu() {
  return (
    <div className="items-start text-stone-300 p-2 rounded-md overflow-hidden flex flex-col m-auto max-w-lg">
      <p className="font-semibold text-center w-full">Emotes</p>
      <OverlayScrollbarsComponent
        element="div"
        options={{ scrollbars: { theme: "os-theme-light" } }}
        className="[&>[data-overlayscrollbars-contents]]:leading-10 w-2/3 mx-auto"
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
