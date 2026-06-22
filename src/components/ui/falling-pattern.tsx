import type { ComponentProps } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type FallingPatternVariant = "streaks" | "dots";

type FallingPatternProps = ComponentProps<"div"> & {
  color?: string;
  backgroundColor?: string;
  duration?: number;
  blurIntensity?: string;
  density?: number;
  animate?: boolean;
  variant?: FallingPatternVariant;
};

/** Posisi anchor tiap partikel (dari tile asli). */
const PATTERN_ANCHORS: [number, number][] = [
  [0, 235],
  [300, 235],
  [150, 117.5],
  [0, 252],
  [300, 252],
  [150, 126],
  [0, 150],
  [300, 150],
  [150, 75],
  [0, 253],
  [300, 253],
  [150, 126.5],
  [0, 204],
  [300, 204],
  [150, 102],
  [0, 134],
  [300, 134],
  [150, 67],
  [0, 179],
  [300, 179],
  [150, 89.5],
  [0, 299],
  [300, 299],
  [150, 149.5],
  [0, 215],
  [300, 215],
  [150, 107.5],
  [0, 281],
  [300, 281],
  [150, 140.5],
  [0, 158],
  [300, 158],
  [150, 79],
  [0, 210],
  [300, 210],
  [150, 105],
];

const DOT_SIZES = [1.6, 2, 2.4, 1.8, 2.2, 1.5, 2.6, 1.9];

function generateStreakBackgroundImage(color: string) {
  const patterns = PATTERN_ANCHORS.flatMap(([x, y], index) => {
    if (index % 3 === 2) {
      return [
        `radial-gradient(1.5px 1.5px at ${x}px ${y}px, ${color} 100%, transparent 150%)`,
      ];
    }

    return [
      `radial-gradient(4px 100px at ${x}px ${y}px, ${color}, transparent)`,
    ];
  });

  return patterns.join(", ");
}

function generateDotBackgroundImage(color: string) {
  return PATTERN_ANCHORS.map(([x, y], index) => {
    const size = DOT_SIZES[index % DOT_SIZES.length];
    return `radial-gradient(${size}px ${size}px at ${x}px ${y}px, ${color} 100%, transparent 150%)`;
  }).join(", ");
}

function generateBackgroundImage(
  color: string,
  variant: FallingPatternVariant = "streaks",
) {
  return variant === "dots"
    ? generateDotBackgroundImage(color)
    : generateStreakBackgroundImage(color);
}

const TILE_BACKGROUND_SIZES = [
  "300px 235px",
  "300px 235px",
  "300px 235px",
  "300px 252px",
  "300px 252px",
  "300px 252px",
  "300px 150px",
  "300px 150px",
  "300px 150px",
  "300px 253px",
  "300px 253px",
  "300px 253px",
  "300px 204px",
  "300px 204px",
  "300px 204px",
  "300px 134px",
  "300px 134px",
  "300px 134px",
  "300px 179px",
  "300px 179px",
  "300px 179px",
  "300px 299px",
  "300px 299px",
  "300px 299px",
  "300px 215px",
  "300px 215px",
  "300px 215px",
  "300px 281px",
  "300px 281px",
  "300px 281px",
  "300px 158px",
  "300px 158px",
  "300px 158px",
  "300px 210px",
  "300px 210px",
  "300px 210px",
].join(", ");

const BACKGROUND_SIZES = TILE_BACKGROUND_SIZES;

const START_POSITIONS =
  "0px 220px, 3px 220px, 151.5px 337.5px, 25px 24px, 28px 24px, 176.5px 150px, 50px 16px, 53px 16px, 201.5px 91px, 75px 224px, 78px 224px, 226.5px 230.5px, 100px 19px, 103px 19px, 251.5px 121px, 125px 120px, 128px 120px, 276.5px 187px, 150px 31px, 153px 31px, 301.5px 120.5px, 175px 235px, 178px 235px, 326.5px 384.5px, 200px 121px, 203px 121px, 351.5px 228.5px, 225px 224px, 228px 224px, 376.5px 364.5px, 250px 26px, 253px 26px, 401.5px 105px, 275px 75px, 278px 75px, 426.5px 180px";

const END_POSITIONS =
  "0px 6800px, 3px 6800px, 151.5px 6917.5px, 25px 13632px, 28px 13632px, 176.5px 13758px, 50px 5416px, 53px 5416px, 201.5px 5491px, 75px 17175px, 78px 17175px, 226.5px 17301.5px, 100px 5119px, 103px 5119px, 251.5px 5221px, 125px 8428px, 128px 8428px, 276.5px 8495px, 150px 9876px, 153px 9876px, 301.5px 9965.5px, 175px 13391px, 178px 13391px, 326.5px 13540.5px, 200px 14741px, 203px 14741px, 351.5px 14848.5px, 225px 18770px, 228px 18770px, 376.5px 18910.5px, 250px 5082px, 253px 5082px, 401.5px 5161px, 275px 6375px, 278px 6375px, 426.5px 6480px";

export function getFallingPatternBackgroundImage(color: string) {
  return generateBackgroundImage(color);
}

export { BACKGROUND_SIZES, END_POSITIONS, START_POSITIONS };

export function FallingPattern({
  color = "var(--color-accent)",
  backgroundColor = "var(--color-bg)",
  duration = 150,
  blurIntensity = "1em",
  density = 1,
  animate = true,
  variant = "streaks",
  className,
}: FallingPatternProps) {
  const isDots = variant === "dots";

  return (
    <div className={cn("relative h-full w-full", className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="size-full"
      >
        <motion.div
          className="relative z-0 size-full"
          style={{
            backgroundColor,
            backgroundImage: generateBackgroundImage(color, variant),
            backgroundSize: TILE_BACKGROUND_SIZES,
          }}
          variants={{
            initial: {
              backgroundPosition: START_POSITIONS,
            },
            animate: {
              backgroundPosition: [START_POSITIONS, END_POSITIONS],
              transition: {
                duration,
                ease: "linear",
                repeat: Number.POSITIVE_INFINITY,
              },
            },
          }}
          initial="initial"
          animate={animate ? "animate" : "initial"}
        />
      </motion.div>
      <div
        className="absolute inset-0 z-[1]"
        style={{
          backdropFilter: isDots ? undefined : `blur(${blurIntensity})`,
          backgroundImage: isDots
            ? undefined
            : `radial-gradient(circle at 50% 50%, transparent 0, transparent 2px, ${backgroundColor} 2px)`,
          backgroundSize: isDots ? undefined : `${8 * density}px ${8 * density}px`,
        }}
      />
    </div>
  );
}
