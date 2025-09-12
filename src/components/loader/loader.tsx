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
import { dl } from "motion/react-client";

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
      animate={{ opacity: !loaded ? 1 : 0, transition: { delay: 1.2 } }}
      exit={{ opacity: 1 }}
    >
      <motion.svg
        width="560"
        height="560"
        viewBox="0 0 560 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        variants={wrapper}
        initial={"initial"}
        animate={loaded ? "load" : "animate"}
        // exit={"load"}
      >
        <MotionConfig
        // transition={{
        //   duration: 0.5,
        //   ease: easeInOut,
        //   repeat: Infinity,
        //   repeatType: "reverse",
        // }}
        >
          <motion.rect
            x="80"
            y="80"
            width="400"
            height="400"
            stroke="black"
            strokeWidth={2}
            variants={border}
          />
          <motion.rect
            x="81"
            width="38"
            height="240"
            fill="black"
            variants={items}
            custom={{ y: 120, h: 240, order: 0 }}
          />
          <motion.rect
            x="121"
            width="38"
            height="120"
            fill="black"
            variants={items}
            custom={{ y: 200, h: 120, order: 1 }}
          />
          <motion.rect
            x="161"
            width="38"
            height="120"
            fill="black"
            variants={items}
            custom={{ y: 200, h: 120, order: 2 }}
          />
          <motion.rect
            x="201"
            width="38"
            height="200"
            fill="black"
            variants={items}
            custom={{ y: 200, h: 120, order: 3 }}
          />
          <motion.rect
            x="241"
            width="38"
            height="160"
            fill="black"
            variants={items}
            custom={{ y: 280, h: 200, order: 4 }}
          />
          <motion.rect
            x="281"
            width="38"
            height="160"
            fill="black"
            variants={items}
            custom={{ y: 280, h: 160, order: 5 }}
          />
          <motion.rect
            x="321"
            width="38"
            height="160"
            fill="black"
            variants={items}
            custom={{ y: 280, h: 160, order: 6 }}
          />
          <motion.rect
            x="361"
            width="38"
            height="160"
            fill="black"
            variants={items}
            custom={{ y: 280, h: 160, order: 7 }}
          />
          <motion.rect
            x="401"
            width="38"
            height="160"
            fill="black"
            variants={items}
            custom={{ y: 280, h: 160, order: 8 }}
          />
          <motion.rect
            x="441"
            width="38"
            height="120"
            fill="black"
            variants={items}
            custom={{ y: 360, h: 120, order: 9 }}
          />
        </MotionConfig>
      </motion.svg>

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
