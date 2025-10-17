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
import { getSortedSpreadsData, SpreadData } from "@/lib/spreads";
import { LenisRef, useLenis } from "lenis/react";
import useSound from "use-sound";
import { Loader } from "@/components/loader/loader";
import { LoaderContext } from "@/context/Loader/LoaderContext";
import { ResizeContext } from "@/context/Resize/ResizeContext";
import { ScrollContext } from "@/context/Scroll/ScrollContext";
import { Navbar } from "@/components/navbar/navbar";
import { HomeDisplay } from "@/components/home/HomeDisplay";
// import dial from "@/assets/audio/dial.mp3";s

export default function Home({ data }: { data: SpreadData[] }) {
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
    index: -1,
    name: "",
    desc: "",
    href: "",
  });

  const { loaded } = useContext(LoaderContext);

  return (
    <Fragment>
      <motion.main className="h-svh items-center relative max-sm:max-h-svh flex flex-col max-sm:portrait:flex-row w-max">
        <motion.section
          className="fixed left-0 top-0 w-full h-svh flex flex-col overflow-auto "
          layoutScroll
        >
          <div
            className="hsm:sm:max-w-none w-full mx-auto flex flex-col justify-center items-center h-full min-h-fit "
            style={{ "--paddingLocal": "1rem" } as React.CSSProperties}
          >
            <AnimatePresence>
              <HomeDisplay
                data={data}
                loaded={loaded}
                item={currentItem}
                itemHandler={setCurrentItem}
              />
            </AnimatePresence>
          </div>
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
