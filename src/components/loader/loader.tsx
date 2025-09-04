import { useEffect, useRef, Dispatch, SetStateAction } from "react";
import { useLenis } from "lenis/react";
import { motion } from "motion/react";

export const Loader = ({
  loaded,
  handler,
}: {
  loaded: boolean;
  handler: () => (value: SetStateAction<boolean>) => void;
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
      className="fixed size-full top-0 left-0 bg-background text-foreground z-50 flex flex-col items-center justify-center text-center"
      style={{ pointerEvents: loaded ? "none" : "auto" }}
      ref={ref}
      onClick={() => {
        closeModal();
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: !loaded ? 1 : 0 }}
      exit={{ opacity: 0 }}
    >
      {/* <div className="size-full "> */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          closeModal();
        }}
      >
        Click anywhere to enter
      </motion.button>
      {/* </div> */}
    </motion.dialog>
  );
};
