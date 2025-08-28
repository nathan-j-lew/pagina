import { Libre_Bodoni } from "next/font/google";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import Link from "next/link";
import { getSortedSpreadsData } from "@/lib/spreads";
import { useLenis } from "lenis/react";
import useSound from "use-sound";
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

  const { scrollYProgress } = useScroll();

  const [currentItem, setCurrentItem] = useState({
    original: 0,
    display: 0,
  });

  const [currentAudio, setCurrentAudio] = useState(1);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.floor(latest * data.length);
    if (latest < 0.01) return;
    setCurrentItem({
      original: index >= data.length ? data.length - 1 : index,
      display: index >= data.length ? data.length - 1 : index,
    });
  });

  const [play] = useSound(`/audio/dial${currentAudio}.mp3`);

  return (
    <div
      className={`${libreBodoni.className} font-sans scrollbar-gutter-stable`}
    >
      <nav className="fixed top-0 inset-x-0 z-10">
        <div className="px-[5%] flex space-x-4">
          <Link href="/about">About</Link>
          <Link href="/image">Test</Link>
        </div>
      </nav>
      <motion.main className="flex flex-col items-center relative">
        <aside className="fixed right-0 top-1/2 -translate-y-1/2 p-4 z-50 flex flex-col gap-2">
          {[1, 2, 3, 4, 5].map((audio) => (
            <button
              key={audio}
              onClick={() => {
                setCurrentAudio(audio);
              }}
              className="cursor-pointer border border-foreground px-2 py-1 m-1 hover:bg-foreground/5 active:bg-foreground/10"
            >
              Version {audio}
            </button>
          ))}
        </aside>
        <motion.section
          className="fixed left-0 top-0 w-full h-dvh"
          layoutScroll
        >
          <div className="flex flex-col items-center justify-center gap-4 mx-auto aspect-55/89 max-h-[100vmin] max-w-[100vmin]">
            <motion.div
              className="w-full flex items-center justify-center "
              layoutId="title"
              layout="position"
            >
              {/* <motion.h2 className="text-xl font-bold text-center text-foreground">
                {data[currentItem.display].title}
              </motion.h2> */}
            </motion.div>
            <Link href={data[currentItem.display].slug} className="w-full">
              <motion.span
                className="block aspect-square max-w-[40rem] max-h-[40rem] size-full bg-blend-difference"
                style={{ backgroundColor: data[currentItem.display].hex }}
                layoutId="background"
              />
            </Link>
            <motion.div
              className="h-full w-full flex relative gap-2 max-w-[40rem]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              // onMouseLeave={() => {
              //   setCurrentItem((original) => ({
              //     original: original.original,
              //     display: original.original,
              //   }));
              //   lenis?.scrollTo(`#${data[currentItem.original].slug}`);
              // }}
            >
              {data.map((_, j) => (
                <Link
                  key={`item-${j}`}
                  className={`flex-1 border border-foreground relative`}
                  href={`#${data[j].slug}`}
                  onPointerEnter={() => {
                    play();
                    setCurrentItem({
                      ...currentItem,
                      display: j,
                    });
                    lenis?.scrollTo(`#${data[j].slug}`, {
                      immediate: true,
                    });
                  }}
                >
                  <span className="absolute h-full w-full -translate-1/2 top-1/2 left-1/2 any-pointer-fine:hidden" />
                </Link>
              ))}
              <motion.div
                className={`bg-foreground absolute h-full w-[calc((100%-2rem)/5)]`}
                style={{
                  x: `calc(${currentItem.display * 100}% + ${
                    currentItem.display * 0.5
                  }rem)`,
                }}
              />
            </motion.div>
          </div>
        </motion.section>
        {data.map((item, i) => (
          <section
            key={`section--${i}`}
            className="w-full h-lvh min-h-[36rem]"
            id={item.slug}
          />
        ))}
      </motion.main>
    </div>
  );
}

export async function getStaticProps() {
  const data = getSortedSpreadsData();
  return {
    props: { data },
  };
}
