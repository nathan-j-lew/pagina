import { LenisRef } from "lenis/react";
import { createContext, createRef, useRef } from "react";
import { RefObject } from "react";

export interface ScrollInfo {
  ref: RefObject<LenisRef | HTMLDivElement | null>;
}

export const ScrollContext = createContext<RefObject<LenisRef | null> | null>(
  null
);
