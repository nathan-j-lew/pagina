import { SpreadData } from "@/lib/spreads";
import {
  AnimationSequence,
  circInOut,
  circOut,
  easeInOut,
  easeOut,
  motion,
  spring,
  stagger,
  useAnimate,
  Variants,
} from "motion/react";
import Link from "next/link";
import Logo from "@/assets/logo.svg";
import { Fragment, useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { AnimateParams, useMotionTimeline } from "@/hooks/useMotionTimeline";
import clsx from "clsx";
import { LoaderContext } from "@/context/Loader/LoaderContext";
import { ResizeContext } from "@/context/Resize/ResizeContext";

export const HomeDisplay = ({
  data,
  loaded,
  item,
  itemHandler,
}: {
  data: SpreadData[];
  loaded: boolean;
  item: {
    index: number;
    name: string;
    href: string;
  };
  itemHandler: (item: { index: number; name: string; href: string }) => void;
}) => {
  type STATES = "loadIn" | "idle" | "preactive" | "active";
  const [animationStateGroup, setAnimationStateGroup] = useState<STATES[]>(
    data.map(() => (loaded ? "active" : "loadIn"))
  );
  const [animationState, setAnimationState] = useState<STATES>(
    loaded ? "active" : "loadIn"
  );

  const [animated, setAnimated] = useState(loaded);
  const router = useRouter();
  const { size } = useContext(ResizeContext);

  const { setLoaded } = useContext(LoaderContext);

  const bars: Variants = {
    preload: {
      opacity: 0,
      translateY: "0%",
      height: "40%",
    },
    loadIn: (custom: { index: number; position: string }, current) => ({
      opacity: 1,
      translateY: [null, "50%"],
      transition: {
        duration: 0.2,
        delay: custom.index * 0.1,
        ease: circOut,
      },
    }),
    idle: (custom: { index: number; position: string }) => ({
      translateY: [null, "-50%"],
      opacity: 1,
      transition: {
        repeat: Infinity,
        repeatType: "reverse",
        delay: custom.index * 0.1,
        duration: 1,
        ease: "circInOut",
      },
    }),
    preactive: {
      translateY: "0%",
      opacity: 1,
      height: "40%",
      transition: { duration: 0.2, ease: easeInOut },
    },
    active: (custom: { index: number; position: string }) => ({
      translateY: "0%",
      opacity: 1,
      height: custom.position == "start" ? "80%" : "60%",
      // transition: {
      //   delay: custom.index * 0.1,
      // },
      // transition: {
      //   repeat: Infinity,
      //   repeatType: "reverse",
      //   delay: custom.index * 0.1,
      //   duration: 1,
      //   ease: "circInOut",
      // },
    }),
  };

  useEffect(() => {
    if (animated) setTimeout(() => setLoaded(true), 1000);
  }, [animated]);

  return (
    <motion.div
      className="flex flex-col sm:grid sm:grid-cols-6 flex-1 min-h-fit max-sm:landscape:flex-row max-sm:justify-center items-center gap-3 size-full"
      initial={"preload"}
      animate={animationState}
      exit={{
        opacity: 0,
        y: "-10%",
      }}
    >
      <motion.div className="flex flex-col sm:flex-row flex-1 items-center justify-end">
        <motion.div
          variants={{
            preload: { opacity: 0 },
            active: { opacity: 1, transition: { delay: 0.3 } },
          }}
        >
          <Link href="/about">
            <motion.span className="block size-12">
              <motion.span className="block size-full scale-105 rounded-full bg-foreground" />
            </motion.span>
            <span className="sr-only">About</span>
          </Link>
        </motion.div>
      </motion.div>
      <div className="w-full flex flex-col justify-center items-center">
        <motion.div
          className="aspect-square border-2 flex gap-x-1 w-full h-auto max-w-[30rem]"
          layoutId="background"
          key="nav_container"
          variants={{
            preload: { borderColor: "#88888800" },
            active: {
              borderColor: "var(--foreground)",
              transition: { when: "afterChildren" },
            },
          }}
        >
          {data.map((spread, i) => (
            <motion.div
              key={`nav--${spread.slug}`}
              className={`size-full bg-[${spread.hex}] relative flex flex-col`}
              layout
              style={{
                justifyContent:
                  animationState == "active" ? spread.position : "center",
              }}
              // variants={{}}
            >
              <motion.a
                initial={"preload"}
                animate={animationStateGroup[i]}
                variants={bars}
                className={clsx(`test absolute w-full transform`)}
                data-position={spread.position}
                layout
                key={`nav_inner--${spread.slug}`}
                custom={{ index: i, position: spread.position }}
                onMouseEnter={() => {
                  if (animated)
                    itemHandler({
                      index: i,
                      name: spread.title,
                      href: `/${spread.slug}`,
                    });
                }}
                href={`/${spread.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (size.width >= 960) {
                    router.push(`/${spread.slug}`);
                  } else {
                    if (animated)
                      itemHandler({
                        index: i,
                        name: spread.title,
                        href: `/${spread.slug}`,
                      });
                  }
                }}
                style={{
                  backgroundColor:
                    item.index == i ? "var(--active)" : "var(--foreground)",
                }}
                onAnimationComplete={() => {
                  if (animationStateGroup[i] == "loadIn") {
                    setAnimationStateGroup((prev) => {
                      const newState = [...prev];
                      newState[i] = "idle";
                      return newState;
                    });
                    if (i == data.length - 1) {
                      setTimeout(() => {
                        setAnimationState("preactive");
                        setAnimationStateGroup(data.map(() => "preactive"));
                      }, 2000);
                    }
                  }
                  if (animationStateGroup[i] == "preactive") {
                    setAnimationState("active");
                    setAnimationStateGroup((prev) => {
                      const newState = [...prev];
                      newState[i] = "active";
                      return newState;
                    });
                  }
                  if (animationState == "active" && i == data.length - 1) {
                    setAnimated(true);
                  }
                }}
              >
                <span className="sr-only">{spread.title}</span>
              </motion.a>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div className="flex flex-col sm:flex-row flex-1 items-center gap-3 relative ">
        <motion.div
          variants={{
            preload: { opacity: 0 },
            active: { opacity: 1, transition: { delay: 0.3 } },
          }}
        >
          <Link href={item.href} className="block ">
            <motion.span className="block size-12">
              <motion.span
                className="block size-full scale-105 rounded-full "
                style={{
                  backgroundColor: item.href
                    ? "var(--foreground)"
                    : "var(--disabled)",
                }}
              />
              <span className="absolute top-full text-pizzi-lg my-2">
                {item.name}
              </span>
            </motion.span>
            <span className="sr-only">{item.name}</span>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
