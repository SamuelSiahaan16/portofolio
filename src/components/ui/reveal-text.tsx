import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import {
  BACKGROUND_SIZES,
  END_POSITIONS,
  getFallingPatternBackgroundImage,
  START_POSITIONS,
} from "@/components/ui/falling-pattern";
import { cn } from "@/lib/utils";

const DEFAULT_LETTER_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?auto=format&fit=crop&w=1200&q=80",
];

type FallingPatternOptions = {
  color?: string;
  duration?: number;
};

export type RevealTextProps = {
  text?: string;
  textColor?: string;
  overlayColor?: string;
  fontSize?: string;
  letterDelay?: number;
  overlayDelay?: number;
  overlayDuration?: number;
  springDuration?: number;
  letterSpacing?: string;
  letterImages?: string[];
  hoverFill?: "images" | "pattern";
  patternProps?: FallingPatternOptions;
  hoverBorderColor?: string;
  className?: string;
};

export function RevealText({
  text = "STUNNING",
  textColor = "text-[var(--color-ink)]",
  overlayColor = "text-[var(--color-accent)]",
  fontSize = "text-[clamp(2.5rem,11vw,7.5rem)]",
  letterDelay = 0.08,
  overlayDelay = 0.05,
  overlayDuration = 0.4,
  springDuration = 600,
  letterSpacing = "gap-[0.06em] sm:gap-[0.08em]",
  letterImages = DEFAULT_LETTER_IMAGES,
  hoverFill = "images",
  patternProps,
  hoverBorderColor,
  className,
}: RevealTextProps) {
  const reduceMotion = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showOverlayText, setShowOverlayText] = useState(reduceMotion === true);
  const usePatternFill = hoverFill === "pattern" && reduceMotion !== true;
  const useAccentHover = hoverFill === "pattern" && reduceMotion === true;

  const patternColor = patternProps?.color ?? "var(--color-accent)";
  const patternDuration = patternProps?.duration ?? 80;

  const patternBackgroundImage = useMemo(
    () => getFallingPatternBackgroundImage(patternColor),
    [patternColor],
  );

  useEffect(() => {
    if (reduceMotion) {
      setShowOverlayText(true);
      return;
    }

    const lastLetterDelay = (text.length - 1) * letterDelay;
    const totalDelay = lastLetterDelay * 1000 + springDuration;

    const timer = window.setTimeout(() => {
      setShowOverlayText(true);
    }, totalDelay);

    return () => window.clearTimeout(timer);
  }, [text.length, letterDelay, springDuration, reduceMotion]);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center select-none",
        className,
      )}
    >
      <div className={cn("flex leading-none", letterSpacing)}>
        {text.split("").map((letter, index) => {
          const isHovered = hoveredIndex === index;

          return (
            <motion.span
              key={`${letter}-${index}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                fontSize,
                "relative inline-block cursor-pointer overflow-hidden font-black tracking-tight",
              )}
              initial={
                reduceMotion
                  ? false
                  : {
                      scale: 0,
                      opacity: 0,
                    }
              }
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                delay: reduceMotion ? 0 : index * letterDelay,
                type: "spring",
                damping: 8,
                stiffness: 200,
                mass: 0.8,
              }}
            >
              <motion.span
                className={cn("absolute inset-0", textColor)}
                animate={{
                  opacity: isHovered ? 0 : 1,
                }}
                transition={{ duration: 0.1 }}
                aria-hidden={isHovered}
              >
                {letter}
              </motion.span>

              {usePatternFill ? (
                <motion.span
                  className="absolute inset-0 bg-clip-text text-transparent"
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    backgroundPosition: isHovered
                      ? [START_POSITIONS, END_POSITIONS]
                      : START_POSITIONS,
                  }}
                  transition={{
                    opacity: { duration: 0.12 },
                    backgroundPosition: isHovered
                      ? {
                          duration: patternDuration,
                          ease: "linear",
                          repeat: Number.POSITIVE_INFINITY,
                        }
                      : { duration: 0 },
                  }}
                  style={{
                    backgroundImage: patternBackgroundImage,
                    backgroundSize: BACKGROUND_SIZES,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                  }}
                  aria-hidden={!isHovered}
                >
                  {letter}
                </motion.span>
              ) : useAccentHover ? (
                <motion.span
                  className={cn("absolute inset-0", overlayColor)}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.1 }}
                  aria-hidden={!isHovered}
                >
                  {letter}
                </motion.span>
              ) : (
                <motion.span
                  className="absolute inset-0 bg-clip-text text-transparent"
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    backgroundPosition: isHovered ? "10% center" : "0% center",
                  }}
                  transition={{
                    opacity: { duration: 0.1 },
                    backgroundPosition: {
                      duration: 3,
                      ease: "easeInOut",
                    },
                  }}
                  style={{
                    backgroundImage: `url('${letterImages[index % letterImages.length]}')`,
                    backgroundSize: "160% auto",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                  }}
                  aria-hidden={!isHovered}
                >
                  {letter}
                </motion.span>
              )}

              {hoverBorderColor ? (
                <motion.span
                  aria-hidden={!isHovered}
                  className="pointer-events-none absolute inset-0 z-[2] font-black"
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    WebkitTextStroke: `0.04em ${hoverBorderColor}`,
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                    paintOrder: "stroke fill",
                  }}
                >
                  {letter}
                </motion.span>
              ) : null}

              {showOverlayText ? (
                <motion.span
                  className={cn(
                    "pointer-events-none absolute inset-0",
                    overlayColor,
                  )}
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{
                    opacity: isHovered
                      ? 0
                      : reduceMotion
                        ? 1
                        : [0, 1, 1, 0],
                  }}
                  transition={{
                    delay: reduceMotion ? 0 : index * overlayDelay,
                    duration: overlayDuration,
                    times: [0, 0.1, 0.7, 1],
                    ease: "easeInOut",
                  }}
                  aria-hidden
                >
                  {letter}
                </motion.span>
              ) : null}

              <span className="invisible">{letter}</span>
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}
