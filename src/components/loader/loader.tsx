import { useEffect, useRef, Dispatch, SetStateAction } from "react";
import { useLenis } from "lenis/react";
import {
  motion,
  stagger,
  MotionConfig,
  easeInOut,
  circOut,
  easeOut,
  cubicBezier,
} from "motion/react";

export const Loader = ({
  loaded,
  handler,
}: {
  loaded: boolean;
  handler: () => void;
}) => {
  const ref = useRef<HTMLDialogElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    lenis?.stop();
    console.log(lenis);
  }, [lenis]);

  const closeModal = () => {
    // if (ref.current) {
    lenis?.start();

    handler();
    // }
  };

  return (
    <motion.dialog
      open={!loaded}
      className="fixed size-full top-0 left-0 bg-background/10 text-foreground z-50 flex flex-col items-center justify-center text-center"
      style={{ pointerEvents: loaded ? "none" : "auto" }}
      ref={ref}
      onClick={() => {
        closeModal();
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: !loaded ? 1 : 0 }}
      exit={{ opacity: 0 }}
    >
      <motion.ul className="flex justify-between gap-x-1 h-8" key="loader">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.li
            key={`loader__item--${i}`}
            className="h-full bg-foreground aspect-9/43"
            initial={{ y: "0%", opacity: 0 }}
            animate={{
              y: ["-12.5%", "12.5%"],
              opacity: 1,
              transition: {
                y: {
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: easeInOut,
                  delay: i * 0.2,
                },
                opacity: {
                  delay: i * 0.2,
                  ease: easeOut,
                  duration: 0.05,
                },
              },
            }}
            exit={{ y: "0%", opacity: 0 }}
          ></motion.li>
        ))}
      </motion.ul>
      <motion.button
        initial={{ opacity: 0, filter: "blur(1px)" }}
        animate={{
          opacity: 1,
          filter: "blur(0px)",
          transition: {
            opacity: { duration: 0.5, ease: easeOut, delay: 1 },
            filter: { duration: 1, ease: easeOut, delay: 1 },
          },
        }}
        exit={{ opacity: 0 }}
        onClick={() => {
          closeModal();
        }}
        className="absolute bottom-16 text-lg"
      >
        Tap anywhere to enter
      </motion.button>
    </motion.dialog>
  );
};
