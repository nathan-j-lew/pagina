import { createContext } from "react";

interface LoadInfo {
  loaded: LoadState;
  setLoaded: (loaded: LoadState) => void;
}

export const LoaderContext = createContext<LoadInfo>({
  loaded: "idle",
  setLoaded: () => {},
});

export type LoadState = "loadIn" | "idle" | "preactive" | "active" | "complete";
