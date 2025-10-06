import { SpreadData } from "@/lib/spreads";
import {
  AnimationSequence,
  circOut,
  easeInOut,
  easeOut,
  motion,
  spring,
  stagger,
  useAnimate,
} from "motion/react";
import Link from "next/link";
import Logo from "@/assets/logo.svg";
import { Fragment, useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { AnimateParams, useMotionTimeline } from "@/hooks/useMotionTimeline";
import clsx from "clsx";
import { LoaderContext } from "@/context/Loader/LoaderContext";

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
  // const [scope, animate] = useMotionTimeline([
  //   [
  //     ".test",
  //     { opacity: 1 },
  //     { duration: 0.5, ease: "easeInOut", delay: stagger(0.1) },
  //   ],

  //   data.map(
  //     (spread, i) =>
  //       [
  //         `.test${i}`,
  //         {
  //           translateY: "0%",
  //           height: spread.position == "start" ? "80%" : "60%",
  //         },
  //         { type: spring, stiffness: 450, damping: 120, mass: 10 },
  //       ] as AnimateParams
  //   ),

  //   [
  //     ".pagina_home",
  //     {
  //       borderColor: "var(--foreground)",
  //     },
  //   ],
  // ]);

  const [scope, animate] = useAnimate();

  const enter: AnimationSequence = [
    [
      ".test",
      { opacity: 1 },
      { duration: 0.5, ease: easeInOut, delay: stagger(0.1) },
    ],
    "load",
    [
      ".test[data-position='start']",
      { translateY: "0%", height: "80%" },

      { type: spring, stiffness: 450, damping: 120, mass: 10 },
    ],
    [
      ".test[data-position='end']",
      { translateY: "0%", height: "60%" },
      { at: "load", type: spring, stiffness: 450, damping: 120, mass: 10 },
    ],
    [
      ".pagina_home",
      { borderColor: "var(--foreground)" },
      { at: "load", delay: 0.2 },
    ],
  ];

  const { setLoaded } = useContext(LoaderContext);

  useEffect(() => {
    console.log("loaded", loaded);
    const animEnter = animate(enter);
    if (!loaded) {
      (async () => {
        animEnter.then(() => {
          console.log("set loaded true");
          setLoaded(true);
          setAnimated(true);
        });
        // setLoaded(true);
      })();
    } else {
      animate(enter).complete();
      setAnimated(true);
    }
  }, []);

  return (
    <div
      className="flex max-sm:portrait:flex-col max-sm:justify-center gap-4 size-full"
      ref={scope}
    >
      <div className="col-span-3">
        <motion.div
          initial={
            loaded
              ? {
                  borderColor: "var(--foreground)",
                }
              : { borderColor: "#88888800" }
          }
          className="pagina_home aspect-square border-2 flex gap-x-1 object-contain size-full"
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
            >
              <motion.a
                initial={
                  loaded
                    ? {
                        opacity: 1,
                        translateY: "0%",
                        height: spread.position === "start" ? "80%" : "60%",
                      }
                    : {
                        opacity: 0,
                        translateY:
                          spread.position === "start" ? "75%" : "-75%",
                        height: "40%",
                      }
                }
                className={clsx(`test absolute w-full transform`)}
                data-position={spread.position}
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
                }}
              >
                <span className="sr-only">{spread.title}</span>
              </motion.a>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="flex flex-col">
        {item.name !== "" ? (
          <Fragment>
            <h2 className="text-pizzi-lg">{item.name}</h2>
            <h3 className="text-pizzi-md">
              {data.find((d) => d.title === item.name)?.subtitle}
            </h3>
          </Fragment>
        ) : (
          <Logo className="h-9" />
        )}
      </div>
    </div>
  );
};
