import Image from "next/image";
import { Libre_Bodoni } from "next/font/google";
import ChevronLeft from "@/assets/icons/chevron-left.svg";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { getSpreadData, getSpreadSlugs } from "@/lib/spreads";
import { ScrollIndicator } from "@/components/scroll/scroll";

const libreBodoni = Libre_Bodoni({
  variable: "--font-libre-bodoni",
  subsets: ["latin"],
});

export default function Page({
  spreadData,
}: {
  spreadData: {
    title: string;
    hex: string;
    slug: string;
  };
}) {
  const { scrollYProgress } = useScroll();
  const mix = useTransform(
    scrollYProgress,
    [0, 1],
    [spreadData.hex, "#888888"]
  );
  return (
    <div className={`${libreBodoni.className} font-sans`}>
      <motion.main className="flex flex-col items-center relative h-[500lvh]">
        <motion.div
          className="fixed inset-0 -z-1"
          layout
          layoutScroll
          layoutId="background"
          style={{
            backgroundColor: mix,
          }}
        />
        <motion.div
          className="w-full flex items-center justify-center "
          layoutId="title"
          layout="position"
        >
          {/* <motion.h2 className="text-xl font-bold text-center text-foreground">
            {spreadData.title}
          </motion.h2> */}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-8 left-8 z-10 text-lg leading-none"
        >
          <Link
            href="/"
            className="mix-blend-difference flex items-center gap-x-1"
          >
            <ChevronLeft className="fill-foreground size-6" /> Back to home
          </Link>
        </motion.div>
        <ScrollIndicator scrollYProgress={scrollYProgress} />
      </motion.main>
    </div>
  );
}

export async function getStaticPaths() {
  const paths = getSpreadSlugs();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const spreadData = getSpreadData(params.slug);
  return {
    props: {
      spreadData,
    },
  };
}
