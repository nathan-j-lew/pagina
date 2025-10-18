import { SpreadData } from "@/lib/spreads";
import {
  AnimationSequence,
  backIn,
  backInOut,
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
import {
  Fragment,
  useEffect,
  useState,
  useContext,
  CSSProperties,
  use,
} from "react";
import { useRouter } from "next/router";
import { AnimateParams, useMotionTimeline } from "@/hooks/useMotionTimeline";
import clsx from "clsx";
import { LoaderContext } from "@/context/Loader/LoaderContext";
import { ResizeContext } from "@/context/Resize/ResizeContext";
import { delay } from "motion";
import { useLenis } from "lenis/react";
import { LoadState } from "@/context/Loader/LoaderContext";

export const HomeDisplay = ({
  data,
  animationState,
  animationHandler,
  item,
  itemHandler,
}: {
  data: SpreadData[];
  animationState: LoadState;
  animationHandler: (state: LoadState) => void;
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
  const [animationStateGroup, setAnimationStateGroup] = useState<LoadState[]>(
    data.map(() => (animationState == "complete" ? "complete" : "loadIn"))
  );
  const router = useRouter();
  const { size, orientation, mini } = useContext(ResizeContext);

  const [animated, setAnimated] = useState<boolean>(false);

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
        mini == 1 && orientation == "landscape" && item.href != ""
          ? "100%"
          : custom.position == "start"
          ? "80%"
          : "60%",
    }),
    complete: (custom: { index: number; position: string }) => ({
      translateY: "0%",
      opacity: 1,
      height:
        mini == 1 && orientation == "landscape" && item.href != ""
          ? "100%"
          : custom.position == "start"
          ? "80%"
          : "60%",
    }),
  };

  useEffect(() => {
    console.log("animationState changed", animationState);
    if (animationState == "preactive") {
      setAnimationStateGroup((prev) => prev.map(() => "preactive"));
    }
  }, [animationState]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key == ";") {
        itemHandler({ index: -1, name: "", desc: "", href: "" });
      }
    };
    if (animationState == "complete") {
      window.addEventListener("keydown", handleKeydown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [animationState]);

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
      <motion.div
        layout
        className="relative max-sm:flex-2 landscape:flex-1 flex flex-col landscape:flex-row gap-12 hsm:col-span-4 hmd:col-span-3 hxl:col-span-2 portrait:max-sm:aspect-5/6 portrait:max-sm:max-h-[36rem]"
      >
        <motion.div className="flex-1 relative w-full hsm:sm:fixed">
          <motion.div
            variants={{
              preload: { opacity: 0 },
              active: {
                opacity: 0,
              },
              complete: {
                opacity: 1,
                transition: {
                  delay: 0.2,
                  ease: circOut,
                },
              },
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
        <motion.div
          // layoutRoot
          className=" bg-red-500/10 flex flex-col justify-center items-center landscape:items-end landscape:justify-start sm:hsm:items-start sm:hsm:justify-center grow container-size portrait:max-hsm:min-h-[216px]"
          variants={{
            preload: {
              position: "absolute",
              width:
                mini !== -1 && orientation == "portrait" ? "100%" : "100vw",
              height:
                mini !== -1 && orientation == "portrait" ? "100%" : "100vh",
            },

            complete: {
              position: "absolute",

              width: "100%",
              height: "100%",
              transition: {
                delay: 0.2,
                ease: circOut,
                // when: "afterChildren",
              },
            },
          }}
          layout
          key="test1"
          onAnimationComplete={() => {
            if (animationState == "complete") {
              setAnimated(true);
            }
          }}
        >
          <motion.div
            className={clsx(
              "p-0.5",
              "contained-portrait:w-full contained-portrait:h-auto contained-landscape:w-auto portrait:max-hsm:min-w-[216px] portrait:max-hsm:min-h-[216px]",
              mini == 1 && orientation == "landscape" && item.name !== ""
                ? "contained-landscape:h-full aspect-5/1 contained-landscape:max-h-[min(6rem,20%)]"
                : "contained-landscape:h-full aspect-square",
              "max-w-[30rem] hsm:sm:max-w-col-4 hmd:max-w-col-3 hxl:max-w-col-2",
              "max-h-[30rem] hsm:sm:max-h-col-4 hmd:max-h-col-3 hxl:max-h-col-2"
            )}
            variants={{
              preload: {
                background: "var(--background)",
                position: "absolute",
                top: "50%",
                right: "50%",
                translate: "50% -50%",
                scale: 0.5,
              },
              active: {
                background: "var(--foreground)",
                scale: 1,
                position: "absolute",
                top: "50%",
                right: "50%",
                translate: "50% -50%",
              },
              complete: {
                background: "var(--foreground)",
                position: "absolute",
                top: mini
                  ? orientation == "landscape"
                    ? "0%"
                    : "calc(3rem)"
                  : orientation == "landscape"
                  ? "50%"
                  : "calc(4.5rem)",
                right: mini
                  ? orientation == "landscape"
                    ? "0%"
                    : "50%"
                  : "50%",

                translate: mini
                  ? orientation == "landscape"
                    ? "0% 0%"
                    : "50% 0%"
                  : orientation == "landscape"
                  ? "50% -50%"
                  : "50% 0%",
                scale: 1,
                transition: {},
              },
            }}
            layout
            key="test2"
            onMouseLeave={() => {
              if (animated && mini == 0 && size.width > 640)
                itemHandler({
                  index: -1,
                  name: "",
                  desc: "",
                  href: "",
                });
            }}

            // layoutId="display"
            // key="display"
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
              // layoutId="background"
              layout
              key="nav_container"
            >
              {data.map((spread, i) => (
                <motion.div
                  key={`nav--${spread.slug}`}
                  className={`size-full bg-[${spread.hex}] relative flex flex-col`}
                  layout
                  style={{
                    justifyContent:
                      animationState == "active" || animationState == "complete"
                        ? spread.position
                        : "center",
                  }}
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
                    }}
                    onMouseEnter={() => {
                      if (animated && !mini)
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
                      if (mini == 0 && size.width > 640) {
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
                      }
                      if (
                        animationStateGroup[i] == "preactive" &&
                        i == data.length - 1
                      ) {
                        animationHandler("active");
                        setAnimationStateGroup((prev) =>
                          prev.map(() => "active")
                        );
                      }
                      if (animationState == "active" && i == data.length - 1) {
                        animationHandler("complete");
                        setAnimationStateGroup((prev) =>
                          Array.from({ length: prev.length }, () => "complete")
                        );
                      }
                    }}
                  >
                    <span className="sr-only">{spread.title}</span>
                  </motion.a>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div className="pointer-events-none landscape:fixed bottom-0 left-0 w-full hsm:static px-(--paddingLocal) flex flex-col flex-1 justify-end items-start gap-3 hsm:sm:col-span-2">
        <motion.div
          variants={{
            preload: { opacity: 0 },
            complete:
              item.name !== ""
                ? {
                    opacity: 1,
                    transition: { ease: "easeOut" },
                  }
                : { opacity: 0 },
          }}
          className="w-full max-w-[30rem] mx-auto hsm:sm:hidden"
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
          className="block w-full hsm:sm:w-full h-24 hsm:sm:h-full"
        >
          <motion.span
            className="block bg-warm-red size-full pointer-events-auto"
            variants={{
              preload: { clipPath: "inset(100% 0% 0% 0%)" },
              complete:
                item.name !== ""
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
