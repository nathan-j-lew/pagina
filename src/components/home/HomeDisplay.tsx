import { SpreadData } from "@/lib/spreads";
import {
  circOut,
  easeInOut,
  easeOut,
  motion,
  spring,
  stagger,
} from "motion/react";
import Link from "next/link";
import Logo from "@/assets/logo.svg";
import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import { useMotionTimeline } from "@/hooks/useMotionTimeline";
import clsx from "clsx";

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
  };
  itemHandler: (item: { index: number; name: string }) => void;
}) => {
  const [animated, setAnimated] = useState(false);
  const router = useRouter();
  const container = {
    initial: {
      borderColor: "var(--background)",
    },
    load: {
      borderColor: "var(--foreground)",
      transition: {
        when: "afterChildren",
        duration: 0.5,
        ease: circOut,
      },
    },
  };

  const bars = {
    initial: (custom: { position: "start" | "end"; index: number }) => ({
      height: "40%",
      translateY: custom.position === "start" ? "75%" : "-75%",
      opacity: 0,
    }),
    load: (custom: { position: "start" | "end"; index: number }) => ({
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: easeOut,
        delay: custom.index * 0.1 + 0.5,
      },
    }),
    move: (custom: { position: "start" | "end"; index: number }) => ({
      // opacity: 1,
      height: custom.position === "start" ? "80%" : "60%",
      translateY: 0,
      transition: {
        // visualDuration: 0.5,
        type: spring,
        stiffness: 450,
        damping: 120,
        mass: 20,
        // ease: easeInOut,
        delay: 1.3,
      },
    }),
  };

  const scope = useMotionTimeline([
    [".test", { rotate: 360 }, { duration: 2, ease: "easeInOut" }],
    [
      ".test",
      { translateY: "0%", height: "60%" },
      { duration: 1, ease: "easeInOut", delay: stagger(0.1) },
    ],
    [
      ".pagina_home",
      {
        borderColor: "var(--foreground)",
      },
    ],
  ]);

  return (
    <div
      className="flex max-sm:portrait:flex-col max-sm:justify-center sm:grid sm:grid-cols-5 sm:items-center gap-4 size-full"
      ref={scope}
    >
      <div className="flex col-span-2 items-center sm:order-1">
        {item.name !== "" ? (
          <h2 className="text-pizzi-lg">{item.name}</h2>
        ) : (
          <Logo className="h-9" />
        )}
      </div>
      <div className="col-span-3">
        <motion.div
          className="pagina_home aspect-square border-2 border-transparent flex gap-x-1 object-contain size-full"
          layoutId="background"
          key="nav_container"
        >
          {data.map((spread, i) => (
            <motion.div
              key={`nav--${spread.slug}`}
              className={`size-full bg-[${spread.hex}] relative flex flex-col overflow-hidden`}
              style={{
                justifyContent:
                  spread.position === "start" ? "flex-start" : "flex-end",
              }}
              layout
              variants={container}
            >
              <motion.a
                className={clsx(
                  "test absolute w-full"
                  // spread.position === "start"
                  //   ? "translate-y-3/4"
                  //   : "-translate-y-3/4"
                )}
                layout
                key={`nav_inner--${spread.slug}`}
                custom={{ index: i, position: spread.position }}
                onMouseEnter={() => {
                  if (animated) itemHandler({ index: i, name: spread.title });
                }}
                href={`/${spread.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/${spread.slug}`);
                }}
                style={{
                  backgroundColor:
                    item.index == i ? "var(--midground)" : "var(--foreground)",
                  translateY: spread.position === "start" ? "75%" : "-75%",
                  height: "40%",
                }}
              >
                <span className="sr-only">{spread.title}</span>
              </motion.a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
