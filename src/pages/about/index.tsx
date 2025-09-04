import { Libre_Bodoni } from "next/font/google";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Fragment, useState } from "react";
import Link from "next/link";
import { getSortedSpreadsData } from "@/lib/spreads";

const libreBodoni = Libre_Bodoni({
  variable: "--font-libre-bodoni",
  subsets: ["latin"],
});

export default function About({
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
    <Fragment>
      <nav className="fixed top-0 inset-x-0 z-10">
        <div className="px-[5%]">
          <Link href="/">Back</Link>
        </div>
      </nav>
      <motion.main className="flex flex-col items-center relative">
        <section>
          <h1>About</h1>
        </section>
        <section>
          <h1>About</h1>
        </section>
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
