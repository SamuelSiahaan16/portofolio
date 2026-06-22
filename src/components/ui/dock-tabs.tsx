import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { zIndex } from "@/config/z-index";
import { dockItems, type DockItemConfig } from "@/config/dock-nav";
import type { DockPlacement } from "@/contexts/DockPlacementContext";
import { TheSvgIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { scrollToSection } from "@/utils/scroll-to-section";

type DockIconProps = {
  item: DockItemConfig;
  mouseX: MotionValue<number>;
};

function DockIcon({ item, mouseX }: DockIconProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [50, 80, 50]);
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const heightSync = useTransform(distance, [-150, 0, 150], [50, 80, 50]);
  const height = useSpring(heightSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const staticSize = reduceMotion ? 56 : undefined;

  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={item.name}
      style={reduceMotion ? { width: staticSize, height: staticSize } : { width, height }}
      onClick={() =>
        scrollToSection(item.id, reduceMotion ? "auto" : "smooth")
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsClicked(true)}
      onMouseUp={() => setIsClicked(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsClicked(false)}
      className="relative flex aspect-square shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
    >
      <motion.div
        className="relative flex h-full w-full items-center justify-center rounded-2xl border border-white/12 bg-white/[0.06] p-2 shadow-lg"
        animate={{
          y: reduceMotion ? 0 : isClicked ? 2 : isHovered ? -6 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17,
        }}
      >
        <motion.div
          className="flex size-9 items-center justify-center"
          animate={{
            scale: reduceMotion ? 1 : isHovered ? 1.08 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 17,
          }}
        >
          <TheSvgIcon name={item.icon} size={30} className="size-[1.875rem]" />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent"
          animate={{
            opacity: isHovered ? 0.35 : 0.15,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 8 : -4,
          scale: isHovered ? 1 : 0.8,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        className="pointer-events-none absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 rounded-md bg-zinc-800/90 px-2 py-1 text-xs whitespace-nowrap text-white backdrop-blur-sm"
      >
        {item.name}
      </motion.div>

      <motion.div
        className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white/80"
        animate={{
          scale: isClicked ? 1.5 : 1,
          opacity: isClicked ? 1 : 0.7,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      />
    </motion.button>
  );
}

type DockTabsProps = {
  activeId?: string;
  placement?: DockPlacement;
  className?: string;
};

export function DockTabs({
  activeId,
  placement = "top",
  className,
}: DockTabsProps) {
  const mouseX = useMotionValue(Infinity);
  const reduceMotion = useReducedMotion();
  const isCentered = placement === "center";
  const visibleItems = activeId
    ? dockItems.filter((item) => item.id !== activeId)
    : dockItems;

  return (
    <motion.nav
      aria-label="Navigasi utama"
      className={cn(
        "pointer-events-none fixed inset-x-0 flex justify-center px-4",
        className,
      )}
      style={{ zIndex: zIndex.dock }}
      initial={false}
      animate={{
        top: isCentered ? "50%" : "1rem",
        y: isCentered ? "-50%" : 0,
      }}
      transition={{
        type: "spring",
        stiffness: isCentered ? 280 : 340,
        damping: isCentered ? 28 : 32,
      }}
    >
      <motion.div
        layout
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={cn(
          "pointer-events-auto mx-auto flex w-fit max-w-full items-center gap-3 overflow-visible rounded-3xl border-2 border-white/20 px-4 py-2 shadow-xl backdrop-blur-md sm:gap-4",
          "min-h-20 bg-[color-mix(in_oklch,var(--color-surface)_72%,transparent)]",
        )}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 22,
          delay: reduceMotion ? 0 : 0.05,
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visibleItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.6 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 32,
              }}
              className="overflow-visible"
            >
              <DockIcon item={item} mouseX={mouseX} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.nav>
  );
}
