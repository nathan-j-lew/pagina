import { createContext } from "react";

interface LoadInfo {
  loaded: boolean;
  setLoaded: (loaded: boolean) => void;
}

export const LoaderContext = createContext<LoadInfo>({
  loaded: false,
  setLoaded: () => {},
});
