import { createContext } from "react";

interface LoadInfo {
  loaded: boolean;
}

export const LoaderContext = createContext<LoadInfo>({
  loaded: false,
});
