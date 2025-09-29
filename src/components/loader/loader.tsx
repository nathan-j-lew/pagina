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
  circInOut,
} from "motion/react";
import Logo from "@/assets/logo.svg";

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
    // console.log(lenis?.isHorizontal);
  }, [lenis]);

  const closeModal = () => {
    // if (ref.current) {
    lenis?.start();
    console.log(lenis?.isHorizontal);
    handler();
    // setTimeout(() => {}, 1000);
    // }
  };

  const wrapper = {
    initial: { scale: 0.5 },
    load: { scale: 0.5, transition: { duration: 0.5, ease: circInOut } },
  };
  const border = {
    initial: { opacity: 0 },
    animate: {
      opacity: 0,
      transition: { duration: 1, ease: easeInOut },
    },
    load: { opacity: 1, transition: { duration: 0.3, ease: circOut } },
  };

  const items = {
    initial: (custom: { h: number; y: number; order: number }) => ({
      opacity: 0,
      y: custom.y,
    }),
    animate: (custom: { h: number; y: number; order: number }) => ({
      opacity: 1,
      y: [custom.y, custom.y - 120 * (custom.h / 400), custom.y],
      transition: {
        y: {
          duration: 1,
          ease: easeInOut,
          delay: custom.order * 0.1,
          repeat: Infinity,
          // repeatType: "loop",
        },
      },
    }),
    load: (custom: { h: number; y: number; order: number }) => ({
      opacity: 1,
      y: custom.y,
    }),
    // animate2: (custom: { y: number; order: number }) => ({
    //   opacity: 1,
    //   y: custom.y + 40,
    // }),
  };

  return (
    <motion.dialog
      open={!loaded}
      className="fixed size-full top-0 left-0 bg-background/100 text-foreground z-50 flex flex-col items-center justify-center text-center"
      style={{ pointerEvents: loaded ? "none" : "auto" }}
      ref={ref}
      onClick={() => {
        closeModal();
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        // transition={{
        //   opacity: { duration: 0.7, ease: easeOut, delay: 0.3 },
        // }}
      >
        <Logo className="min-h-9 object-contain" />
      </motion.div>

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
