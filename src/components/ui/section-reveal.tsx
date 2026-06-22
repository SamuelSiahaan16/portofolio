import { useRef, type ReactNode, type RefObject } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type SectionRevealDirection = "up" | "down" | "left" | "right" | "none";

type SectionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: SectionRevealDirection;
  distance?: number;
  blur?: boolean;
  scale?: boolean;
  /** Pakai state inView dari parent (mis. section) supaya semua blok sinkron. */
  active?: boolean;
};

function getOffset(direction: SectionRevealDirection, distance: number) {
  switch (direction) {
    case "up":
      return { x: 0, y: distance };
    case "down":
      return { x: 0, y: -distance };
    case "left":
      return { x: distance, y: 0 };
    case "right":
      return { x: -distance, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
}

export function SectionReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 28,
  blur = true,
  scale = false,
  active,
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const internalInView = useInView(ref, {
    amount: 0.2,
    margin: "-8% 0px -10% 0px",
  });
  const isInView = active ?? internalInView;

  const offset = getOffset(direction, distance);
  const hidden = {
    opacity: 0,
    x: offset.x,
    y: offset.y,
    scale: scale ? 0.96 : 1,
    ...(blur ? { filter: "blur(10px)" as const } : {}),
  };
  const visible = {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    ...(blur ? { filter: "blur(0px)" as const } : {}),
  };

  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={hidden}
      animate={isInView ? visible : hidden}
      transition={{
        duration: 0.55,
        delay: isInView ? delay : 0,
        ease: EASE,
      }}
    >
      {children}
    </motion.div>
  );
}

type SectionBackdropRevealProps = {
  children: ReactNode;
  className?: string;
  sectionRef: RefObject<HTMLElement | null>;
};

export function SectionBackdropReveal({
  children,
  className,
  sectionRef,
}: SectionBackdropRevealProps) {
  const reduceMotion = useReducedMotion();
  const isInView = useInView(sectionRef, {
    amount: 0.18,
    margin: "-6% 0px -6% 0px",
  });

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      aria-hidden
      className={className}
      initial={false}
      animate={
        isInView
          ? { opacity: 1, scale: 1 }
          : { opacity: 0.45, scale: 1.04 }
      }
      transition={{ duration: 0.7, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
