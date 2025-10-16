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
import { delay } from "motion";
import { useLenis } from "lenis/react";

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
    desc: string;
    href: string;
  };
  itemHandler: (item: {
    index: number;
    name: string;
    desc: string;
    href: string;
  }) => void;
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
  const { size, mini } = useContext(ResizeContext);

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
      height:
        mini && item.href != ""
          ? "100%"
          : custom.position == "start"
          ? "80%"
          : "60%",
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

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key == ";") {
        itemHandler({ index: -1, name: "", desc: "", href: "" });
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  const lenis = useLenis();

  return (
    <motion.div
      className="flex flex-col flex-1 min-h-fit gap-12 size-full hsm:sm:grid hsm:sm:grid-cols-6 hsm:sm:gap-3"
      initial={"preload"}
      animate={animationState}
      exit={{
        opacity: 0,
        y: "-10%",
      }}
    >
      <div className=" max-sm:flex-2 landscape:flex-1 flex flex-col landscape:flex-row gap-12 hsm:sm:col-span-4">
        <motion.div className="flex-1 relative w-full hsm:sm:fixed">
          <motion.div
            variants={{
              preload: { opacity: 0 },
              active: { opacity: 1, transition: { delay: 0.3 } },
            }}
            className="w-full portrait:max-w-[30rem] portrait:mx-auto"
          >
            <Link href="/about" className="">
              <motion.span className="block aspect-logo hsm:h-9 h-6">
                <motion.span className="block size-full bg-foreground" />
              </motion.span>
              <span className="sr-only">About</span>
            </Link>
          </motion.div>
        </motion.div>
        <div className="size-full flex flex-col justify-center items-center landscape:items-end landscape:justify-start sm:hsm:items-start sm:hsm:justify-center bg-red-500 grow overflow-hidden container-size">
          <motion.div
            className={clsx(
              "p-0.5",
              "contained-portrait:w-full contained-portrait:h-auto contained-landscape:w-auto overflow-hidden",
              mini && item.name !== ""
                ? "contained-landscape:h-1/5 aspect-5/1"
                : "contained-landscape:h-full aspect-square",
              "max-w-[30rem]",
              "max-h-[30rem]"
            )}
            variants={{
              preload: {
                background: "var(--background)",
              },
              active: {
                background: "var(--foreground)",
              },
            }}
            layout
          >
            <motion.div
              className={clsx(
                // "contained-landscape:h-full",
                // "aspect-square",
                "bg-background",
                "size-full",
                "relative",
                "flex",
                "gap-x-1"
                // "border-2"
              )}
              layoutId="background"
              // layout="size"
              key="nav_container"
              variants={{
                preload: {
                  // borderColor: "#88888800",
                  // transformOrigin: "50% 0% 0px",
                },
                active: {
                  // borderColor: "var(--foreground)",
                  // aspectRatio: mini && item.name !== "" ? "5 / 1" : "1 / 1",
                  // scale: mini && item.name !== "" ? 0.2 : 1,
                  // height: mini && item.name !== "" ? "20%" : "100%",
                  // scaleY: mini && item.name !== "" ? 0.2 : 1,
                  // transformOrigin: "50% 0% 0px",
                  // transition: { when: "afterChildren" },
                },
              }}
              // style={{
              //   boxShadow: "inset 0 0 0 2px var(--foreground)",
              // }}
            >
              {/* <motion.div className="absolute size-full border-2" /> */}
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
                    custom={{
                      index: i,
                      position: spread.position,
                      // mini: mini && item.name !== "",
                    }}
                    onMouseEnter={() => {
                      if (animated)
                        itemHandler({
                          index: i,
                          name: spread.title,
                          desc: spread.subtitle,
                          href: `/${spread.slug}`,
                        });
                    }}
                    href={`/${spread.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (size.width >= 960 && !mini) {
                        router.push(`/${spread.slug}`);
                      } else {
                        if (animated) {
                          itemHandler({
                            index: i,
                            name: spread.title,
                            desc: spread.subtitle,
                            href: `/${spread.slug}`,
                          });
                          // if (lenis) lenis.scrollTo(lenis.limit);
                        }
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
          </motion.div>
        </div>
      </div>

      <motion.div className="pointer-events-none landscape:fixed bottom-0 left-0 w-full hsm:static px-(--paddingLocal) flex flex-col flex-1 justify-end items-start gap-3 hsm:sm:col-span-2">
        <motion.div
          variants={{
            preload: { opacity: 0 },
            active:
              animated && item.name !== ""
                ? {
                    opacity: 1,
                    transition: { ease: "easeOut" },
                  }
                : { opacity: 0 },
          }}
          className="w-full max-w-[30rem] mx-auto hsm:sm:landscape:hidden"
        >
          <Link href={item.href} className="pointer-events-none h-15 block">
            <hgroup className="flex flex-col items-start">
              <h3 className="text-pizzi-lg pointer-events-auto">{item.name}</h3>
              <p className="pointer-events-auto">{item.desc}</p>
            </hgroup>
          </Link>
        </motion.div>
        <Link
          href={item.href}
          className="block w-full hsm:sm:w-full h-24 hsm:sm:h-full pointer-events-auto"
        >
          <motion.span
            className="block bg-warm-red size-full"
            variants={{
              preload: { clipPath: "inset(100% 0% 0% 0%)" },
              active:
                animated && item.name !== ""
                  ? {
                      clipPath: "inset(0% 0% 0% 0%)",
                      transition: { ease: circOut },
                    }
                  : { clipPath: "inset(100% 0% 0% 0%)" },
            }}
          />
          <span className="sr-only">Open {item.name}</span>
        </Link>
      </motion.div>
    </motion.div>
  );
};
