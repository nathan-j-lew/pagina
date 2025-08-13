import { Libre_Bodoni } from "next/font/google";
// import ChevronLeft from "@/assets/icons/chevron-left.svg";
import { motion, useScroll, useTransform } from "motion/react";
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
  spreadData: { title: string; hex: string };
}) {
  const { scrollYProgress } = useScroll();
  const mix = useTransform(
    scrollYProgress,
    [0, 1],
    [spreadData.hex, "#888888"]
  );
  return (
    <div
      className={`${libreBodoni.className} font-sans scrollbar-gutter-stable`}
    >
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
          className="fixed top-1/20 left-1/20 z-10 text-lg leading-none"
        >
          <Link href="/" className="mix-blend-difference flex items-center">
            Back to home
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
  console.log(spreadData);
  if (!spreadData) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      spreadData,
    },
  };
}
