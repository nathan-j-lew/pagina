import { createContext } from "react";

export interface PointerInfo {
  fine: boolean;
  coarse: boolean;
}

export const PointerContext = createContext<PointerInfo>({
  fine: false,
  coarse: false,
});
