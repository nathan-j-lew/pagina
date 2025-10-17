import { createContext } from "react";

export interface ResizeInfo {
  size: { width: number; height: number };
  orientation: "landscape" | "portrait";
  mini?: boolean;
}

export const ResizeContext = createContext<ResizeInfo>({
  size: { width: 0, height: 0 },
  orientation: "landscape",
  mini: true,
});
