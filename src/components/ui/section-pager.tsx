import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { zIndex } from "@/config/z-index";
import { resolveScrollTarget } from "@/config/scroll-targets";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useFooterInView } from "@/hooks/useFooterInView";
import { usePointerActivity } from "@/hooks/usePointerActivity";
import { cn } from "@/lib/utils";
import { scrollToAdjacent } from "@/utils/scroll-to-section";

type PagerButtonProps = {
  label: string;
  direction: "up" | "down";
  disabled: boolean;
  tabIndex: number;
  onClick: () => void;
};

function ChevronUpIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function PagerButton({
  label,
  direction,
  disabled,
  tabIndex,
  onClick,
}: PagerButtonProps) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      disabled={disabled}
      tabIndex={tabIndex}
      onClick={onClick}
      className={cn(
        "flex size-11 items-center justify-center rounded-xl border border-white/12 bg-white/[0.06] text-[var(--color-ink)] shadow-lg backdrop-blur-md transition-colors",
        "hover:bg-white/[0.12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
        "disabled:pointer-events-none disabled:opacity-30",
      )}
      whileTap={{ scale: 0.94 }}
    >
      {direction === "up" ? <ChevronUpIcon /> : <ChevronDownIcon />}
    </motion.button>
  );
}

export function SectionPager() {
  const reduceMotion = useReducedMotion();
  const pointerActive = usePointerActivity();
  const activeSection = useActiveSection();
  const footerInView = useFooterInView();
  const pagerRef = useRef<HTMLDivElement>(null);
  const current = resolveScrollTarget(activeSection, footerInView);
  const scrollBehavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";

  const canGoUp = current !== "hero";
  const canGoDown = current !== "footer";
  const tabIndex = pointerActive ? 0 : -1;

  useEffect(() => {
    if (pointerActive) return;

    const active = document.activeElement;
    if (
      active instanceof HTMLElement &&
      pagerRef.current?.contains(active)
    ) {
      active.blur();
    }
  }, [pointerActive]);

  const goPrev = () => {
    if (!canGoUp) return;
    scrollToAdjacent(current, "prev", scrollBehavior);
  };

  const goNext = () => {
    if (!canGoDown) return;
    scrollToAdjacent(current, "next", scrollBehavior);
  };

  return (
    <div
      ref={pagerRef}
      className="pointer-events-none fixed right-4 bottom-6 sm:right-6 sm:bottom-8"
      style={{ zIndex: zIndex.sectionPager }}
    >
      <motion.div
        className={cn(
          "flex flex-col gap-2",
          pointerActive ? "pointer-events-auto" : "pointer-events-none",
        )}
        inert={pointerActive ? undefined : true}
        initial={false}
        animate={{
          opacity: pointerActive ? 1 : 0,
          x: pointerActive ? 0 : 12,
        }}
        transition={{
          duration: reduceMotion ? 0 : 0.22,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <PagerButton
          label="Section sebelumnya"
          direction="up"
          disabled={!canGoUp}
          tabIndex={tabIndex}
          onClick={goPrev}
        />
        <PagerButton
          label="Section berikutnya"
          direction="down"
          disabled={!canGoDown}
          tabIndex={tabIndex}
          onClick={goNext}
        />
      </motion.div>
    </div>
  );
}
