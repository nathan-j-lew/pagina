import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MousePositionContext } from "@/context/MousePosition/MousePosition";
import { useState, useEffect, Fragment } from "react";
import ReactLenis, { useLenis } from "lenis/react";

export default function App({ Component, pageProps }: AppProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState<{
    x: number | null;
    y: number | null;
  }>({ x: null, y: null });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      setClicked({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousedown", handleClick);
    return () => {
      window.removeEventListener("mousedown", handleClick);
    };
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      setClicked({ x: null, y: null });
    };
    window.addEventListener("mouseup", handleClick);
    return () => {
      window.removeEventListener("mouseup", handleClick);
    };
  }, []);

  const lenis = useLenis((lenis) => {
    // called every scroll
    console.log(lenis);
  });

  return (
    <Fragment>
      <ReactLenis root />
      <MousePositionContext
        value={{ position: mousePosition, clicked: clicked }}
      >
        <Component {...pageProps} />
      </MousePositionContext>
    </Fragment>
  );
}
