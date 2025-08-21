import { Libre_Bodoni } from "next/font/google";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { getSortedSpreadsData } from "@/lib/spreads";

const libreBodoni = Libre_Bodoni({
  variable: "--font-libre-bodoni",
  subsets: ["latin"],
});

export default function Home({
  data,
}: {
  data: { title: string; hex: string; slug: string; order: number }[];
}) {
  const { scrollYProgress } = useScroll();
  const [currentItem, setCurrentItem] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.floor(latest * data.length);
    if (latest < 0.01) return;
    setCurrentItem(index >= data.length ? data.length - 1 : index);
  });

  return (
    <div
      className={`${libreBodoni.className} font-sans scrollbar-gutter-stable`}
    >
      <nav className="fixed top-0 inset-x-0 z-10">
        <div className="px-[5%]">
          <Link href="/about">About</Link>
        </div>
      </nav>
      <motion.main className="flex flex-col items-center relative">
        <motion.section
          className="fixed left-0 top-0 w-full h-dvh"
          layoutScroll
        >
          <div className="flex flex-col items-center justify-center gap-4 size-full">
            <motion.div
              className="w-full flex items-center justify-center "
              layoutId="title"
              layout="position"
            >
              <motion.h2 className="text-xl font-bold text-center text-foreground">
                {data[currentItem].title}
              </motion.h2>
            </motion.div>
            <Link href={data[currentItem].slug}>
              <motion.span
                className="block aspect-square size-[80vmin] max-w-[40rem] max-h-[40rem] bg-blend-difference"
                style={{ backgroundColor: data[currentItem].hex }}
                layoutId="background"
              />
            </Link>
            <motion.div
              className="h-4 border border-foreground w-[80vmin] flex relative max-w-[40rem]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {data.map((_, j) => (
                <Link
                  key={`item-${j}`}
                  className={`flex-1 border border-foreground relative`}
                  href={`#${data[j].slug}`}
                >
                  <span className="absolute h-12 w-full -translate-1/2 top-1/2 left-1/2 any-pointer-fine:hidden" />
                </Link>
              ))}
              <motion.div
                className={`bg-foreground absolute h-full w-1/5`}
                style={{ x: currentItem * 100 + "%" }}
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
