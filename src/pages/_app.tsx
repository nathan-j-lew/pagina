import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MousePositionContext } from "@/context/MousePosition/MousePositionContext";
import { LoaderContext } from "@/context/Loader/LoaderContext";
import { useState, useEffect, Fragment, useRef } from "react";
import ReactLenis, { LenisRef, useLenis } from "lenis/react";
import { Loader } from "@/components/loader/loader";
import localFont from "next/font/local";
import { ScrollContext } from "@/context/Scroll/ScrollContext";
import { ResizeContext, ResizeInfo } from "@/context/Resize/ResizeContext";
import { AnimatePresence } from "motion/react";

const pizzi = localFont({
  src: [
    { path: "../styles/fonts/PizziVF.woff", weight: "400", style: "normal" },
    { path: "../styles/fonts/PizziVF.woff2", weight: "400", style: "normal" },
  ],
  variable: "--font-pizzi",
});

export default function App({ Component, pageProps }: AppProps) {
  const [resize, setResize] = useState<ResizeInfo>({
    size: { width: 0, height: 0 },
    orientation: "landscape",
  });

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
      setResize({
        size: { width: window.innerWidth, height: window.innerHeight },
        orientation:
          window.innerWidth > window.innerHeight ? "landscape" : "portrait",
      });
      setLoaded(true);
      // console.log(lenis);
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

  const ref = useRef<LenisRef>(null);

  // useEffect(() => {
  //   console.log(taps);
  // }, [taps]);

  return (
    <Fragment>
      <ResizeContext
        value={{ size: resize.size, orientation: resize.orientation }}
      >
        {/* <div className="fixed z-100 top-0 right-0 portrait:bg-red-500 bg-green-500">
          <div>
            {resize.size.width > resize.size.height ? "Landscape" : "Portrait"}
          </div>
          <div>{resize.orientation}</div>
        </div> */}
        <ScrollContext value={ref}>
          <ReactLenis
            options={{
              syncTouch: true,
              gestureOrientation:
                resize.size.width > resize.size.height ||
                resize.size.width > 640
                  ? "vertical"
                  : "horizontal",
              orientation:
                resize.size.width > resize.size.height ||
                resize.size.width > 640
                  ? "vertical"
                  : "horizontal",
            }}
            className="w-screen min-h-svh overflow-x-auto overflow-y-hidden sm:overflow-y-auto sm:overflow-x-hidden"
            ref={ref}
          >
            <MousePositionContext
              value={{ position: mousePosition, clicked: clicked, taps: taps }}
            >
              <LoaderContext value={{ loaded: loaded, setLoaded: setLoaded }}>
                <div
                  className={`${pizzi.variable} font-sans scrollbar-gutter-stable`}
                >
                  <Component {...pageProps} />
                </div>
              </LoaderContext>
            </MousePositionContext>
          </ReactLenis>
        </ScrollContext>
      </ResizeContext>
    </Fragment>
  );
}
