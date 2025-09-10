import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MousePositionContext } from "@/context/MousePosition/MousePositionContext";
import { LoaderContext } from "@/context/Loader/LoaderContext";
import { useState, useEffect, Fragment } from "react";
import ReactLenis from "lenis/react";
import { Loader } from "@/components/loader/loader";
import localFont from "next/font/local";
import { ResizeContext } from "@/context/Resize/ResizeContext";

const pizzi = localFont({
  src: [
    { path: "../styles/fonts/PizziVF.woff", weight: "400", style: "normal" },
    { path: "../styles/fonts/PizziVF.woff2", weight: "400", style: "normal" },
  ],
  variable: "--font-pizzi",
});

export default function App({ Component, pageProps }: AppProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [loaded, setLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState<{
    x: number | null;
    y: number | null;
  }>({ x: null, y: null });
  const [taps, setTaps] = useState<
    [
      {
        x: number | null;
        y: number | null;
      },
      {
        x: number | null;
        y: number | null;
      }
    ]
  >([
    { x: null, y: null },
    { x: null, y: null },
  ]);

  const updateSize = () => {
    if (typeof window !== "undefined") {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
  };

  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    const updateTaps = (e: TouchEvent) => {
      setTaps([
        { x: e.touches[0].clientX, y: e.touches[0].clientY },
        { x: e.touches[0].clientX, y: e.touches[0].clientY },
      ]);
    };
    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("touchmove", updateTaps);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("touchmove", updateTaps);
    };
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      setClicked({ x: e.clientX, y: e.clientY });
    };
    const handleTap = (e: TouchEvent) => {
      setTaps((prev) => [
        { x: prev[1].x, y: prev[1].y },
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
    const handleClick = () => {
      setClicked({ x: null, y: null });
    };
    const handleTap = () => {
      setTaps([
        { x: null, y: null },
        { x: null, y: null },
      ]);
    };

    window.addEventListener("mouseup", handleClick);
    window.addEventListener("touchend", handleTap);
    return () => {
      window.removeEventListener("mouseup", handleClick);
      window.removeEventListener("touchend", handleTap);
    };
  }, []);

  // useEffect(() => {
  //   console.log(taps);
  // }, [taps]);

  return (
    <Fragment>
      <ResizeContext value={{ size: { width: 0, height: 0 } }}>
        <div className="fixed top-0 right-0">
          {size.width}, {size.height}
        </div>
        <ReactLenis root options={{ syncTouch: true }} />
        <MousePositionContext
          value={{ position: mousePosition, clicked: clicked, taps: taps }}
        >
          <LoaderContext value={{ loaded: loaded }}>
            <div
              className={`${pizzi.variable} font-sans scrollbar-gutter-stable`}
            >
              <Loader loaded={loaded} handler={() => setLoaded(true)} />
              <Component {...pageProps} />
            </div>
          </LoaderContext>
        </MousePositionContext>
      </ResizeContext>
    </Fragment>
  );
}
