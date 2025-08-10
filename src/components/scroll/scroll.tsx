import {
  // animate,
  motion,
  MotionValue,
  useAnimate,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "motion/react";
import {
  Fragment,
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
    // called every scroll
    console.log(lenis);
  });
  const mousePosition = useContext(MousePositionContext);

  const [dialPos, setDialPos] = useState({ x: 0, y: 0 });
  const [dialRadius, setDialRadius] = useState(0);

  const [newAngle, setNewAngle] = useState(0);

  const newAngleMotion = useSpring(newAngle, {
    stiffness: 100,
    damping: 10,
  });

  const ref = useRef<SVGSVGElement>(null);
  const scale = useSpring(1, {
    stiffness: 100,
    damping: 15,
  });
  const y = useSpring("0%", {
    stiffness: 100,
    damping: 15,
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1.01]);

  const updateDialInfo = () => {
    if (ref.current) {
      setDialPos({
        x:
          ref.current.getBoundingClientRect().left +
          (scale.get() * ref.current.clientWidth) / 2,
        y:
          ref.current.getBoundingClientRect().top +
          (scale.get() * ref.current.clientHeight) / 2,
      });
      setDialRadius(scale.get() * ref.current.clientWidth);
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

  useEffect(() => {
    window.addEventListener("resize", updateDialInfo);
    return () => {
      window.removeEventListener("resize", updateDialInfo);
    };
  });

  const trackedMousePosition = useMemo(() => {
    return {
      x: trunc((mousePosition.position.x ?? 0) - dialPos.x),
      y: trunc((mousePosition.position.y ?? 0) - dialPos.y),
    };
  }, [mousePosition.position, mousePosition.clicked, dialPos]);

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
      y: -prevMousePosition.current.y,
    };
    const vec2 = {
      x: trackedMousePosition.x,
      y: -trackedMousePosition.y,
    };

    const len1 = Math.hypot(vec1.x, vec1.y);

    const len2 = Math.hypot(vec2.x, vec2.y);

    const norm1 = {
      x: vec1.x / len1,
      y: vec1.y / len1,
    };

    const norm2 = {
      x: vec2.x / len2,
      y: vec2.y / len2,
    };

    const numerator = trunc(norm1.x * norm2.x + norm1.y * norm2.y);
    const denominator = trunc(
      Math.hypot(norm1.x, norm1.y) * Math.hypot(norm2.x, norm2.y)
    );
    const dotProduct = trunc(numerator / denominator);
    console.log(Math.hypot(vec1.x, vec1.y), Math.hypot(vec2.x, vec2.y));
    let theta = trunc(Math.acos(dotProduct));
    const det = trunc(norm1.x * norm2.y - norm1.y * norm2.x);
    return {
      angle: theta,
      det: det,
    };
  }, [trackedMousePosition, prevMousePosition.current]);

  useEffect(() => {
    if (mousePosition.clicked.x !== null && mousePosition.clicked.y !== null) {
      if (Math.abs(newAngle) <= 10) {
        setNewAngle((old) => trunc(old + dot.angle * (dot.det < 0 ? 1 : -1)));
      }
    }
  }, [dot]);

  useEffect(() => {
    if (Math.abs(newAngle) > 10) {
      setNewAngle(Math.sign(newAngle) * 10);
    }
    newAngleMotion.set(newAngle / 10);
  }, [newAngle]);

  useMotionValueEvent(newAngleMotion, "change", (latest) => {
    lenis?.scrollTo(
      (lenis.dimensions.scrollHeight - lenis.dimensions.height) * latest
    );
  });

  const absNewAngleMotion = useTransform(newAngleMotion, (v) => Math.abs(v));
  const signNewAngleMotion = useTransform(newAngleMotion, (v) =>
    v < 0 ? -1 : 1
  );

  return (
    <Fragment>
      <div className="fixed top-0 left-0 p-4">
        <div>{`${mousePosition.position.x}, ${mousePosition.position.y}`}</div>
        <div>{`${prevMousePosition.current.x}, ${prevMousePosition.current.y}`}</div>
        <div>{`${trackedMousePosition.x}, ${trackedMousePosition.y}`}</div>
      </div>
      <div className="fixed top-0 right-0 p-4">
        {/* <p>Dial position: {`${dialPos.x}, ${dialPos.y}`}</p> */}
        <p>Dial radius: {`${dialRadius}`}</p>
        <p>{`${mousePosition.clicked.x}, ${mousePosition.clicked.y}`}</p>
        <p>
          D:{" "}
          {mousePosition.clicked.x !== null &&
            mousePosition.position.x - mousePosition.clicked.x}
          ,{" "}
          {mousePosition.clicked.y !== null &&
            mousePosition.position.y - mousePosition.clicked.y}
        </p>
        <p>
          R1:{" "}
          {mousePosition.clicked.x !== null &&
            mousePosition.clicked.x - dialPos.x}
          ,{" "}
          {mousePosition.clicked.y !== null &&
            mousePosition.clicked.y - dialPos.y}
          ,{" "}
          {mousePosition.clicked.x !== null &&
            mousePosition.clicked.y !== null &&
            Math.hypot(
              mousePosition.clicked.x - dialPos.x,
              mousePosition.clicked.y - dialPos.y
            )}
        </p>
        <p>
          R2:{" "}
          {mousePosition.clicked.x !== null &&
            mousePosition.position.x - dialPos.x}
          ,{" "}
          {mousePosition.clicked.y !== null &&
            mousePosition.position.y - dialPos.y}
          ,{" "}
          {mousePosition.clicked.x !== null &&
            mousePosition.clicked.y !== null &&
            Math.hypot(
              mousePosition.position.x - dialPos.x,
              mousePosition.position.y - dialPos.y
            )}
        </p>
        {/* <p>Dots: {dot.dot}</p> */}
        <p>Angles: {dot.angle}</p>
        <p>Determinant: {dot.det}</p>
        <p>{newAngle}</p>
      </div>
      <div className="fixed bottom-0 inset-x-0 flex justify-center mb-4">
        <motion.svg
          className="size-12"
          viewBox={"0 0 64 64"}
          id="scroll-bounds"
          style={{
            scale,
            y,
          }}
          onHoverStart={() => {
            scale.set(4);
            y.set("-150%");
          }}
          onHoverEnd={() => {
            scale.set(1);
            y.set("0%");
          }}
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
          />
          <motion.circle
            cx="32"
            cy="32"
            r="16"
            style={{
              pathLength: pathLength,
              fill: "none",
              stroke: "var(--foreground)",
              strokeWidth: 32,
            }}
          />
          <motion.circle
            cx="32"
            cy="32"
            r="30"
            style={{
              pathLength: absNewAngleMotion,
              scaleY: signNewAngleMotion,
              fill: "none",
              stroke: "red",
              strokeWidth: 4,
            }}
          />
          <motion.circle
            cx="32"
            cy="32"
            r="2"
            style={{
              fill: "blue",
            }}
          />
        </motion.svg>
      </div>
    </Fragment>
  );
};
