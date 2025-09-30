import { createContext } from "react";
import type { YOUARE } from "@/types";

export type TIdentityContext = null | YOUARE;

export const IdentityContext = createContext<TIdentityContext>(null);
