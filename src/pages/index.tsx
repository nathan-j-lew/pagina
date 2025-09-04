import { Libre_Bodoni } from "next/font/google";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getSortedSpreadsData } from "@/lib/spreads";
import { useLenis } from "lenis/react";
import useSound from "use-sound";
import { Loader } from "@/components/loader/loader";
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

  useEffect(() => {
    playSprite({
      id: (currentItem.display + 1).toString(),
    });
  }, [currentItem.display]);

  const [play] = useSound(`/audio/dial${currentAudio}.mp3`);
  const [playSprite] = useSound("/audio/pizzicato.mp3", {
    sprite: {
      1: [0, 300],
      2: [500, 300],
      3: [1000, 300],
      4: [1500, 300],
      5: [2000, 300],
    },
  });

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
        <motion.section
          className="fixed left-0 top-0 w-full h-dvh py-2 flex flex-col overflow-hidden"
          layoutScroll
        >
          <div className="flex flex-col justify-center items-center h-full">
            <div
              className="flex flex-col items-center justify-stretch gap-2 aspect-55/89 object-contain my-auto overflow-hidden"
              style={{
                width:
                  "min(calc(100vw - (1rem * 55 / 89)), calc((55 * (100vh - 1rem) / 89)))",
              }}
            >
              <Link
                href={data[currentItem.display].slug}
                className="w-full object-contain"
              >
                <motion.span
                  className="block aspect-square max-w-[40rem] max-h-[40rem] bg-blend-difference object-contain"
                  style={{
                    backgroundColor: data[currentItem.display].hex,
                    border: "1px solid var(--foreground)",
                  }}
                  layoutId="background"
                />
              </Link>
              <motion.div
                className="w-full h-full flex relative gap-2"
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
                      // playSprite({ id: (j + 1).toString() });
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
