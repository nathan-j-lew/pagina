import { Libre_Bodoni } from "next/font/google";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getSortedSpreadsData } from "@/lib/spreads";
import { useLenis } from "lenis/react";
import useSound from "use-sound";
import { Loader } from "@/components/loader/loader";
import { LoaderContext } from "@/context/Loader/LoaderContext";
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
  const lenis = useLenis();

  const { scrollXProgress, scrollYProgress } = useScroll();

  const [currentItem, setCurrentItem] = useState({
    original: 0,
    display: 0,
  });

  const [currentAudio, setCurrentAudio] = useState(1);

  useMotionValueEvent(scrollXProgress, "change", (latest) => {
    const index = Math.floor(latest * data.length);
    if (latest < 0.01) return;
    setCurrentItem({
      original: index >= data.length ? data.length - 1 : index,
      display: index >= data.length ? data.length - 1 : index,
    });
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.floor(latest * data.length);
    if (latest < 0.01) return;
    setCurrentItem({
      original: index >= data.length ? data.length - 1 : index,
      display: index >= data.length ? data.length - 1 : index,
    });
  });

  useEffect(() => {
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

  return (
    <Fragment>
      <nav className="fixed top-0 inset-x-0 z-10">
        <div className="px-[5%] flex space-x-4">
          <Link href="/about">About</Link>
          <Link href="/image">Test</Link>
        </div>
      </nav>
      <motion.main className="items-center relative max-sm:max-h-lvh flex flex-col max-sm:portrait:flex-row w-max">
        <motion.section
          className="fixed left-0 top-0 w-full h-dvh py-2 flex flex-col overflow-hidden"
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
                  >
                    {data.map((_, j) => (
                      <Link
                        key={`item-${j}`}
                        className={`flex-1 relative flex flex-col justify-end`}
                        style={{
                          background:
                            j === currentItem.display
                              ? "transparent"
                              : "var(--foreground)",
                        }}
                        href={`#${data[j].slug}`}
                        onMouseEnter={() => {
                          setCurrentItem({
                            ...currentItem,
                            display: j,
                          });
                          lenis?.scrollTo(`#${data[j].slug}`, {
                            immediate: true,
                          });
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
                      </Link>
                    ))}
                    {currentItem.display > 0 && (
                      <motion.div
                        className={`border-4 border-foreground absolute h-full pointer-events-none -z-1`}
                        style={{
                          width: `calc(${currentItem.display - 1} * 0.25rem + ${
                            currentItem.display
                          } * (100% - 1rem)/5)`,
                        }}
                      />
                    )}
                    {currentItem.display < 4 && (
                      <motion.div
                        className={`border-4 border-foreground absolute h-full pointer-events-none -z-1`}
                        style={{
                          right: 0,
                          width: `calc(${
                            5 - currentItem.display - 2
                          } * 0.25rem + ${
                            5 - currentItem.display - 1
                          } * (100% - 1rem)/5)`,
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
            className="min-w-screen h-lvh min-h-[36rem]"
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
