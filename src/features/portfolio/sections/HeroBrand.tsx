import { motion, useReducedMotion } from "motion/react";
import { RevealText } from "@/components/ui/reveal-text";
import { BRAND } from "@/config/copy";
import { zIndex } from "@/config/z-index";
import { useDockPlacement } from "@/contexts/DockPlacementContext";
import { cn } from "@/lib/utils";

export function HeroBrand() {
  const placement = useDockPlacement();
  const reduceMotion = useReducedMotion();
  const isHome = placement === "center";

  return (
    <motion.div
      aria-hidden={!isHome}
      className={cn(
        "pointer-events-none fixed inset-x-0 flex justify-center px-4",
        !isHome && "pointer-events-none",
      )}
      style={{
        zIndex: zIndex.heroBrand,
        top: "calc(42% - 0.5rem)",
      }}
      initial={false}
      animate={{
        opacity: isHome ? 1 : 0,
        y: isHome ? 0 : reduceMotion ? 0 : -24,
        visibility: isHome ? "visible" : "hidden",
      }}
      transition={{
        duration: reduceMotion ? 0 : 0.28,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div
        className={cn(
          "-translate-y-full pb-5",
          isHome ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <RevealText
          text={BRAND.heroText}
          textColor="text-[var(--color-ink)]"
          overlayColor="text-[var(--color-accent)]"
          fontSize="text-[clamp(2.75rem,12vw,7.5rem)]"
          letterDelay={0.07}
          overlayDelay={0.04}
          overlayDuration={0.4}
          springDuration={600}
          letterSpacing="gap-[0.12em] sm:gap-[0.16em] md:gap-[0.2em]"
          hoverFill="pattern"
          hoverBorderColor="#ff3d7f"
          patternProps={{
            duration: 80,
          }}
        />
      </div>
    </motion.div>
  );
}
