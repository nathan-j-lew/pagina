import { createContext } from "react";

interface MouseInfo {
  position: { x: number; y: number };
  clicked: { x: number | null; y: number | null };
  taps: { x: number | null; y: number | null }[];
}

export const MousePositionContext = createContext<MouseInfo>({
  position: { x: 0, y: 0 },
  clicked: { x: null, y: null },
  taps: [],
});
