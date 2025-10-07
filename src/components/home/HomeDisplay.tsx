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

  return (
    <div className="flex max-sm:portrait:flex-col max-sm:justify-center gap-4 size-full">
      <div className="col-span-3">
        <motion.div
          className="pagina_home aspect-square border-2 flex gap-x-1 object-contain size-full"
          layoutId="background"
          key="nav_container"
          initial={"preload"}
          animate={animationState}
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
              className={`size-full bg-[${spread.hex}] relative flex flex-col perspective-near`}
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
                  if (size.width >= 640) {
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
                    item.index == i ? "var(--midground)" : "var(--foreground)",
                  // rotateX: item.index == i ? "-120deg" : "0deg",
                  // transformOrigin: "center bottom",
                }}
                onAnimationComplete={() => {
                  if (animationStateGroup[i] == "loadIn") {
                    if (i == data.length - 1) {
                      setTimeout(() => {
                        setAnimationState("preactive");
                        setAnimationStateGroup(data.map(() => "preactive"));
                        setAnimated(true);
                        setLoaded(true);
                      }, 2000);
                    }
                    setAnimationStateGroup((prev) => {
                      const newState = [...prev];
                      newState[i] = "idle";
                      return newState;
                    });
                    // setAnimated(true);
                    // setLoaded(true);
                  }
                  if (animationStateGroup[i] == "preactive") {
                    setAnimationState("active");
                    setAnimationStateGroup((prev) => {
                      const newState = [...prev];
                      newState[i] = "active";
                      return newState;
                    });
                  }
                }}
              >
                <span className="sr-only">{spread.title}</span>
              </motion.a>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="flex landscape:flex-col ">
        {item.name !== "" ? (
          <Fragment>
            <div className="flex flex-col">
              <h2 className="text-pizzi-lg">{item.name}</h2>
              <h3 className="text-pizzi-md">
                {data.find((d) => d.title === item.name)?.subtitle}
              </h3>
            </div>
            <Link
              href={item.href}
              className="bg-foreground size-9  max-sm:portrait:ml-auto rounded-full"
            />
          </Fragment>
        ) : null}
      </div>
    </div>
  );
};
