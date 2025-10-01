import type { ComponentProps, PropsWithChildren } from "react";
import clsx from "clsx";

export function Button(
  props: PropsWithChildren<
    ComponentProps<"button"> & { theme: "light" | "dark" }
  >,
) {
  return (
    <button
      onClick={props.onClick}
      data-theme={props.theme}
      type="button"
      title={props.title}
      className={clsx(
        "cursor-pointer rounded-md bg-transparent p-1 transition-colors",
        {
          "hover:bg-stone-700": props.theme === "dark",
          "hover:bg-stone-400": props.theme === "light",
        },
        props.className,
      )}
    >
      {props.value}
      {props.children}
    </button>
  );
}
