import { Libre_Bodoni } from "next/font/google";
import {
  AnimatePresence,
  motion,
  useDragControls,
  useMotionValue,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import {
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { getSortedSpreadsData } from "@/lib/spreads";
import { LenisRef, useLenis } from "lenis/react";
import useSound from "use-sound";
import { Loader } from "@/components/loader/loader";
import { LoaderContext } from "@/context/Loader/LoaderContext";
import { ResizeContext } from "@/context/Resize/ResizeContext";
import { ScrollContext } from "@/context/Scroll/ScrollContext";
// import dial from "@/assets/audio/dial.mp3";

const libreBodoni = Libre_Bodoni({
  variable: "--font-libre-bodoni",
  subsets: ["latin"],
});

export default function Home({
  data,
}: {
  data: { title: string; hex: string; slug: string; order: number }[];
}) {
  const scrollContext = useContext(ScrollContext);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollContext != null) {
      console.log("scrollContext", scrollContext);
      scrollRef.current = scrollContext.current?.wrapper || null;
    }
  }, [scrollContext]);

  const lenis = useLenis();

  const [dragging, setDragging] = useState(false);

  const { scrollXProgress, scrollYProgress } = useScroll({
    container: scrollRef,
  });

  const [currentItem, setCurrentItem] = useState({
    original: 0,
    display: 0,
  });

  useMotionValueEvent(scrollXProgress, "change", (latest) => {
    const index = Math.floor(latest * data.length);
    if (latest < 0) return;
    setCurrentItem({
      original: index >= data.length ? data.length - 1 : index,
      display: index >= data.length ? data.length - 1 : index,
    });
    if (!dragConstraintsRef.current) return;
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.floor(latest * data.length);
    if (latest < 0.01) return;
    setCurrentItem({
      original: index >= data.length ? data.length - 1 : index,
      display: index >= data.length ? data.length - 1 : index,
    });
    // dragPos.jump(index);
  });

  useEffect(() => {
    if (lenis) {
      // console.log(currentItem.display, data.length);
      dragPos.jump((currentItem.display / (data.length - 1)) * dragWidth);
    }
    playSprite({
      id: (currentItem.display + 1).toString(),
    });
  }, [currentItem.display]);

  const { loaded } = useContext(LoaderContext);
  const [playSprite] = useSound("/audio/sevenths.mp3", {
    sprite: {
      1: [0, 400],
      2: [500, 400],
      3: [1000, 400],
      4: [1500, 400],
      5: [2000, 400],
    },
  });
  const dragPos = useMotionValue(0);

  useMotionValueEvent(dragPos, "change", (latest) => {
    if (!dragConstraintsRef.current || !thumbRef.current) return;
    const width =
      dragConstraintsRef.current.clientWidth - thumbRef.current.clientWidth;

    const progress = latest / width;

    if (dragging) {
      lenis?.scrollTo(lenis?.limit * progress, {
        immediate: true,
      });
    }
  });

  const size = useContext(ResizeContext);

  const dragConstraintsRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const dragWidth = useMemo(() => {
    if (!dragConstraintsRef.current || !thumbRef.current) return 0;
    return (
      dragConstraintsRef.current.clientWidth -
      (thumbRef.current?.clientWidth || 0)
    );
  }, [dragConstraintsRef.current, thumbRef.current]);

  useEffect(() => {
    if (loaded) {
      lenis?.scrollTo(0, { immediate: true });
      setCurrentItem({ original: 0, display: 0 });
    }
  }, [loaded]);

  useEffect(() => {
    if (dragConstraintsRef.current) {
      // console.log(dragConstraintsRef.current.clientLeft);
      // console.log(dragPos.get());
    }
  }, [currentItem.display]);

  useEffect(() => {
    console.log("dragWidth", dragWidth);
  }, [dragWidth]);

  return (
    <Fragment>
      <nav className="fixed top-0 inset-x-0 z-10">
        <div className="px-[5%] flex space-x-4">
          <Link href="/about">About</Link>
          <Link href="/image">Test</Link>
        </div>
      </nav>
      <motion.main className="items-center relative max-sm:max-h-svh flex flex-col max-sm:portrait:flex-row w-max">
        <motion.section
          className="fixed left-0 top-0 w-full h-svh py-2 flex flex-col overflow-hidden"
          layoutScroll
        >
          <AnimatePresence>
            {loaded && (
              <div className="flex flex-col justify-center items-center h-full">
                <div className="flex flex-col max-sm:landscape:flex-row items-center justify-stretch gap-1 aspect-[1/sqrt(2)] max-sm:landscape:aspect-[sqrt(2)/1] w-[min(100vw,calc(100vh/sqrt(2)))] max-sm:landscape:w-[min(100vw,calc(100vh*sqrt(2)))] object-contain my-auto overflow-hidden ">
                  <Link
                    href={data[currentItem.display].slug}
                    className="w-full object-contain"
                  >
                    <motion.span
                      className="block aspect-square max-w-[40rem] max-h-[40rem] bg-blend-difference object-contain"
                      style={{
                        backgroundColor: data[currentItem.display].hex,
                        // border: "1px solid var(--foreground)",
                      }}
                      layoutId="background"
                    />
                  </Link>
                  <motion.div
                    className="w-full h-full flex relative gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    ref={dragConstraintsRef}
                  >
                    {data.map((_, j) => (
                      <div
                        key={`item-${j}`}
                        className={`flex-1 relative flex flex-col justify-end`}
                        style={{
                          background:
                            j === currentItem.display
                              ? "transparent"
                              : "var(--foreground)",
                          pointerEvents:
                            j === currentItem.display ? "none" : "auto",
                        }}
                        // href={`#${data[j].slug}`}
                        onMouseEnter={() => {
                          if (
                            size.size.width >= 640 &&
                            lenis &&
                            Math.abs(lenis?.velocity) < 20
                          ) {
                            setCurrentItem({
                              ...currentItem,
                              display: j,
                            });
                            lenis?.scrollTo(`#${data[j].slug}`, {
                              immediate: true,
                            });
                          }
                        }}
                      >
                        <span
                          className="text-2xl p-1"
                          style={{
                            color:
                              j === currentItem.display
                                ? "var(--foreground)"
                                : "var(--background)",
                          }}
                        >
                          {j + 1}
                        </span>
                        {/* <span className="absolute h-full w-full -translate-1/2 top-1/2 left-1/2 any-pointer-fine:hidden" /> */}
                      </div>
                    ))}
                    {currentItem.display > 0 && (
                      <motion.div
                        className={`border-4 border-foreground absolute h-full pointer-events-none -z-1`}
                        style={{
                          width: `calc(${currentItem.display - 1} * 0.25rem + ${
                            currentItem.display
                          } * (100% - ${data.length - 1} * 0.25rem)/${
                            data.length
                          })`,
                        }}
                      />
                    )}
                    <motion.div
                      // data-lenis-prevent
                      className={`absolute h-full z-10 flex items-center justify-center bg-red-500/10`}
                      drag="x"
                      dragConstraints={{
                        left: 0,
                        // right: 100,
                        right:
                          dragConstraintsRef.current && thumbRef.current
                            ? dragConstraintsRef.current.clientWidth -
                              thumbRef.current.clientWidth
                            : 0,
                      }}
                      dragElastic={false}
                      dragMomentum={false}
                      // dragControls={controls}
                      whileDrag={{ scale: 1.2 }}
                      dragTransition={{
                        power: 0,
                        // timeConstant: 0.3,
                        modifyTarget: (target) =>
                          Math.round((target / dragWidth) * (data.length - 1)) *
                          (dragWidth / (data.length - 1)),
                      }}
                      onDragStart={() => {
                        setDragging(true);
                      }}
                      onDragEnd={() => {
                        setDragging(false);
                      }}
                      style={{
                        touchAction: "none",
                        x: dragPos,
                        width: `calc((100% - ${data.length - 1} * 0.25rem) / ${
                          data.length
                        })`,
                      }}
                      ref={thumbRef}
                    >
                      <div className="size-4 rounded-full bg-red-500" />
                    </motion.div>
                    {currentItem.display < data.length - 1 && (
                      <motion.div
                        className={`border-4 border-foreground absolute h-full pointer-events-none -z-1`}
                        style={{
                          right: 0,
                          width: `calc(${
                            data.length - currentItem.display - 2
                          } * 0.25rem + ${
                            data.length - currentItem.display - 1
                          } * (100% - ${data.length - 1} * 0.25rem)/${
                            data.length
                          })`,
                        }}
                      />
                    )}
                  </motion.div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </motion.section>
        {data.map((item, i) => (
          <section
            key={`section--${i}`}
            className="min-w-[100vw] h-svh min-h-[36rem]"
            id={item.slug}
          />
        ))}
      </motion.main>
    </Fragment>
  );
}

export async function getStaticProps() {
  const data = getSortedSpreadsData();
  return {
    props: { data },
  };
}
