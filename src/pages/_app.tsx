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
  const [taps, setTaps] = useState<
    {
      x: number | null;
      y: number | null;
    }[]
  >([]);

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
    const handleTap = (e: TouchEvent) => {
      setTaps((prev) => [
        ...prev,
        { x: e.touches[0].clientX, y: e.touches[0].clientY },
      ]);
    };
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("touchstart", handleTap);
    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("touchstart", handleTap);
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

  const lenis = useLenis((lenis) => {});

  return (
    <Fragment>
      <ReactLenis root />
      <MousePositionContext
        value={{ position: mousePosition, clicked: clicked, taps: taps }}
      >
        {/* <div className="fixed top-32 left-0 pointer-events-none z-10">
          Taps
          {taps.map((tap, index) => (
            <span
              key={index}
              className="block"
            >{`Tap at (${tap.x}, ${tap.y})`}</span>
          ))}
        </div> */}
        <Component {...pageProps} />
      </MousePositionContext>
    </Fragment>
  );
}
