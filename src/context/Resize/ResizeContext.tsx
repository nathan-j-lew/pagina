import { createContext } from "react";

interface ResizeInfo {
  size: { width: number; height: number };
}

export const ResizeContext = createContext<ResizeInfo>({
  size: { width: 0, height: 0 },
});
