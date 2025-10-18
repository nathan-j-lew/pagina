import { createContext } from "react";

export interface ResizeInfo {
  size: { width: number; height: number };
  orientation: "landscape" | "portrait";
  mini?: 1 | 0 | -1;
}

export const ResizeContext = createContext<ResizeInfo>({
  size: { width: 0, height: 0 },
  orientation: "landscape",
  mini: -1,
});
