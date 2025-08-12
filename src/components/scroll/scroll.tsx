import {
  motion,
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "motion/react";
import {
  Fragment,
  memo,
  use,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { trunc } from "@/lib/utils";
import { MousePositionContext } from "@/context/MousePosition/MousePosition";
import { useLenis } from "lenis/react";

export const ScrollIndicator = ({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue;
}) => {
  const lenis = useLenis((lenis) => {
    if (mousePosition.clicked.x != null) return;
    if (mousePosition.clicked.y != null) return;
    if (mousePosition.taps[0].x != null) return;
    if (mousePosition.taps[0].y != null) return;
  });
  const mousePosition = useContext(MousePositionContext);

  const [dial, setDial] = useState({ x: 0, y: 0, radius: 0 });

  const ref = useRef<SVGSVGElement>(null);

  const scale = useSpring(1, {
    stiffness: 150,
    damping: 15,
  });
  const y = useSpring("0%", {
    stiffness: 150,
    damping: 15,
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    console.log("scrollYProgress", latest);
  });

  const circumference = 2 * Math.PI * 16;

  const clampedScrollYProgress = useTransform(scrollYProgress, [0, 1], [0, 1], {
    clamp: true,
  });
  const strokeDashoffset = useTransform(
    clampedScrollYProgress,
    (value) => circumference * (1 - value)
  );
  const testOffset = useSpring(strokeDashoffset, {
    stiffness: 100,
    damping: 25,
  });

  const updateDialInfo = () => {
    if (ref.current) {
      setDial({
        x:
          ref.current.getBoundingClientRect().left +
          (scale.get() * ref.current.clientWidth) / 2,
        y:
          ref.current.getBoundingClientRect().top +
          (scale.get() * ref.current.clientHeight) / 2,
        radius: (ref.current.clientWidth / 2) * scale.get(),
      });
    }
  };
  useEffect(() => {
    updateDialInfo();
  }, [ref.current]);

  useMotionValueEvent(scale, "change", () => {
    updateDialInfo();
  });
  useMotionValueEvent(scale, "animationComplete", () => {
    updateDialInfo();
  });

  const trackedMousePosition = useMemo(() => {
    if (mousePosition.taps[1].x !== null && mousePosition.taps[1].y !== null) {
      return {
        x: trunc(mousePosition.taps[1].x - dial.x),
        y: trunc(mousePosition.taps[1].y - dial.y),
      };
    }
    return {
      x: trunc((mousePosition.position.x ?? 0) - dial.x),
      y: trunc((mousePosition.position.y ?? 0) - dial.y),
    };
  }, [mousePosition.position, mousePosition.clicked, mousePosition.taps, dial]);

  const prevMousePosition = useRef<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  useEffect(() => {
    prevMousePosition.current = trackedMousePosition;
  }, [trackedMousePosition]);

  const dot = useMemo(() => {
    const vec1 = {
      x: prevMousePosition.current.x,
      y: prevMousePosition.current.y,
    };
    const vec2 = {
      x: trackedMousePosition.x,
      y: trackedMousePosition.y,
    };

    const touchVec1 = {
      x: mousePosition.taps[0].x ? mousePosition.taps[0].x - dial.x : 0,
      y: mousePosition.taps[0].y ? mousePosition.taps[0].y - dial.y : 0,
    };

    const touchVec2 = {
      x: mousePosition.taps[1].x ? mousePosition.taps[1].x - dial.x : 0,
      y: mousePosition.taps[1].y ? mousePosition.taps[1].y - dial.y : 0,
    };

    const len1 = Math.hypot(vec1.x, vec1.y);
    const len2 = Math.hypot(vec2.x, vec2.y);

    const lenTouch1 = Math.hypot(touchVec1.x, touchVec1.y);
    const lenTouch2 = Math.hypot(touchVec2.x, touchVec2.y);

    const norm1 = {
      x: vec1.x / len1,
      y: vec1.y / len1,
    };

    const norm2 = {
      x: vec2.x / len2,
      y: vec2.y / len2,
    };

    const normTouch1 = {
      x: touchVec1.x / lenTouch1 || 0,
      y: touchVec1.y / lenTouch1 || 0,
    };

    const normTouch2 = {
      x: touchVec2.x / lenTouch2 || 0,
      y: touchVec2.y / lenTouch2 || 0,
    };

    const numerator = trunc(norm1.x * norm2.x + norm1.y * norm2.y);
    const numeratorTouch = trunc(
      normTouch1.x * normTouch2.x + normTouch1.y * normTouch2.y
    );
    const denominator = trunc(
      Math.hypot(norm1.x, norm1.y) * Math.hypot(norm2.x, norm2.y)
    );
    const denominatorTouch = trunc(
      Math.hypot(normTouch1.x, normTouch1.y) *
        Math.hypot(normTouch2.x, normTouch2.y)
    );
    const dotProduct = trunc(numerator / denominator);
    const dotProductTouch = trunc(numeratorTouch / denominatorTouch);

    let theta = trunc(Math.acos(dotProduct));
    let thetaTouch = trunc(Math.acos(dotProductTouch));
    const det = trunc(norm1.x * norm2.y - norm1.y * norm2.x);
    const detTouch = trunc(
      normTouch1.x * normTouch2.y - normTouch1.y * normTouch2.x
    );
    return {
      angle: theta,
      angleTouch: thetaTouch,
      det: det,
      detTouch: detTouch,
    };
  }, [trackedMousePosition, prevMousePosition.current, mousePosition.taps]);

  useEffect(() => {
    if (
      (mousePosition.clicked.x !== null && mousePosition.clicked.y !== null) ||
      mousePosition.taps[0].x !== null
    ) {
      const dist = Math.hypot(trackedMousePosition.x, trackedMousePosition.y);
      const distInit = Math.hypot(
        mousePosition.clicked.x ?? 999,
        mousePosition.clicked.y ?? 999
      );
      if (
        dist < dial.radius ||
        (mousePosition.taps[0].x !== null && distInit < dial.radius)
      ) {
        const test = trunc(
          scrollYProgress.get() +
            dot.angle *
              (dot.det > 0 ? 1 : -1) *
              (mousePosition.taps[0].x !== null ? 0.1 : 0.1)
        );
        lenis?.scrollTo(
          (lenis.dimensions.scrollHeight - lenis.dimensions.height) * test,
          {
            immediate: true,
          }
        );
      }
    }
  }, [dot]);

  return (
    <Fragment>
      {/* <div className="fixed top-0 right-0 w-full h-full pointer-events-none z-50">
        {trackedMousePosition.x !== 0 && (
          <Fragment>
            <div>
              {prevMousePosition.current.x}, {prevMousePosition.current.y}
            </div>
            <div>
              {trackedMousePosition.x}, {trackedMousePosition.y}
            </div>
            <div>
              {dial.x}, {dial.y}
            </div>
            <div>{dial.radius}</div>
          </Fragment>
        )}
      </div> */}
      <div className="fixed bottom-0 inset-x-0 flex justify-center mb-4">
        <motion.svg
          className="size-18"
          viewBox={"0 0 64 64"}
          id="scroll-bounds"
          style={{
            scale,
            y,
            cursor: "pointer",
            touchAction: "none",
          }}
          onPointerEnter={() => {
            scale.set(3);
            y.set("-100%");
          }}
          onPointerLeave={() => {
            scale.set(1);
            y.set("0%");
          }}
          //   onPointer
          //   whileTap={}
          ref={ref}
        >
          <motion.circle
            cx="32"
            cy="32"
            r="32"
            style={{
              fill: "var(--foreground)",
              opacity: 0.1,
            }}
            // onPointerDownCapture={(e) => e.stopPropagation()}
          />
          <motion.circle
            key={"scroll-path"}
            cx="32"
            cy="32"
            r="16"
            style={{
              //   pathLength: scrollYProgress,
              fill: "none",
              stroke: "var(--foreground)",
              strokeWidth: 32,
              strokeDasharray: circumference,
              strokeDashoffset: testOffset,
            }}
          />

          {/* <motion.circle
            cx="32"
            cy="32"
            r="2"
            style={{
              fill: "blue",
            }}
          /> */}
        </motion.svg>
      </div>
    </Fragment>
  );
};
