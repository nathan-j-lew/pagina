import { Libre_Bodoni } from "next/font/google";
import {
  AnimatePresence,
  motion,
  useDragControls,
  useMotionValue,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  circOut,
  circInOut,
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
import { Navbar } from "@/components/navbar/navbar";
import { s } from "motion/react-client";
// import dial from "@/assets/audio/dial.mp3";

const libreBodoni = Libre_Bodoni({
  variable: "--font-libre-bodoni",
  subsets: ["latin"],
});

export default function Home({
  data,
}: {
  data: {
    title: string;
    hex: string;
    slug: string;
    order: number;
    position: "start" | "end";
  }[];
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

  const [mode, setMode] = useState<"grid" | "list">("grid");

  const setModeGrid = () => {
    setMode("grid");
  };

  const setModeList = () => {
    setMode("list");
  };

  const { scrollXProgress, scrollYProgress } = useScroll({
    container: scrollRef,
  });

  const [currentItem, setCurrentItem] = useState({
    original: 0,
    display: 0,
  });

  const { loaded } = useContext(LoaderContext);

  const size = useContext(ResizeContext);

  const container = {
    initial: {
      borderColor: "var(--background)",
    },
    load: {
      borderColor: "var(--foreground)",
      transition: {
        delay: 1.3,
        duration: 0.5,
        ease: circOut,
      },
    },
    mode: (custom: { mode: "grid" | "list" }) => ({
      rotate: custom.mode === "grid" ? 0 : 90,
      // scale: custom.mode === "grid" ? [null, 0.5, null] : [null, 0.5, null],
      transition: { duration: 3, ease: circInOut },
    }),
    // animate: {
  };

  const bars = {
    initial: {
      height: "40%",
      top: "50%",
      translateY: "-50%",
      opacity: 0,
    },
    load: (custom: { position: "start" | "end"; index: number }) => ({
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: circOut,
        delay: custom.index * 0.1 + 0.5,
      },
    }),
    move: (custom: { position: "start" | "end"; index: number }) => ({
      top: custom.position === "start" ? 0 : "",
      bottom: custom.position != "start" ? 0 : "",
      height: custom.position === "start" ? "40%" : "20%",
      translateY: "0%",
      transition: {
        duration: 0.5,
        ease: circOut,
        delay: 1.3,
      },
    }),
  };

  useEffect(() => {
    if (loaded) {
      lenis?.scrollTo(0, { immediate: true });
      setCurrentItem({ original: 0, display: 0 });
    }
  }, [loaded]);

  return (
    <Fragment>
      <Navbar modeSwitches={[setModeGrid, setModeList]} mode={mode} />
      <motion.main className="items-center relative max-sm:max-h-svh flex flex-col max-sm:portrait:flex-row w-max">
        <motion.section
          className="fixed left-0 top-0 w-full h-svh py-2 flex flex-col overflow-hidden"
          layoutScroll
        >
          <AnimatePresence>
            {loaded && (
              <div className="flex flex-col justify-center items-center h-full px-4">
                <motion.div
                  className="aspect-square portrait:w-full max-w-[100vh] max-h-[100vw] landscape:h-full border-2 divide-x-2 size-full flex"
                  // initial={{ opacity: 0 }}
                  // animate={{ opacity: 1, transition: { delay: 0.5 } }}
                  initial={"initial"}
                  animate={["load", "mode"]}
                  custom={{ mode: mode }}
                  variants={container}
                >
                  {data.map((spread, i) => (
                    <motion.div
                      key={spread.slug}
                      className={`size-full bg-[${spread.hex}] relative`}
                      initial={{
                        borderColor: "var(--background)",
                      }}
                      animate={{
                        borderColor: "var(--foreground)",
                        transition: {
                          delay: 1.3,
                          duration: 0.5,
                          ease: circOut,
                        },
                      }}
                    >
                      <motion.div
                        className="absolute w-full bg-foreground"
                        layout
                        layoutId={`nav--${spread.slug}`}
                        key={`nav--${spread.slug}`}
                        initial="initial"
                        animate={["load", "move"]}
                        variants={bars}
                        custom={{ index: i, position: spread.position }}
                      >
                        <Link className="block size-full" href={spread.slug} />
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.section>
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
