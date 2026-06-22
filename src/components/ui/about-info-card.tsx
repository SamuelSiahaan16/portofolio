import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";

type AboutInfoCardProps = {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  className?: string;
};

export function AboutInfoCard({
  title,
  subtitle,
  description,
  badge,
  className,
}: AboutInfoCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-lg backdrop-blur-md",
        className,
      )}
    >
      {badge ? (
        <span className="mb-2 inline-block rounded-full border border-white/12 bg-white/[0.06] px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-[var(--color-accent)]">
          {badge}
        </span>
      ) : null}
      {subtitle ? (
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
          {subtitle}
        </p>
      ) : null}
      <h3 className="text-pretty mt-1 text-sm font-semibold text-[var(--color-ink)]">
        {title}
      </h3>
      {description ? (
        <p className="text-pretty mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
          {description}
        </p>
      ) : null}
    </article>
  );
}

type AboutStatCardProps = {
  end: number;
  suffix?: string;
  label: string;
  icon?: ReactNode;
  className?: string;
  duration?: number;
};

function useCountUp(
  end: number,
  enabled: boolean,
  instant: boolean,
  duration: number,
) {
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsubscribe = count.on("change", (value) => {
      setDisplay(Math.round(value));
    });
    return unsubscribe;
  }, [count]);

  useEffect(() => {
    if (!enabled) return;

    if (instant) {
      count.set(end);
      return;
    }

    count.set(0);
    const controls = animate(count, end, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });

    return () => controls.stop();
  }, [count, duration, enabled, end, instant]);

  return display;
}

export function AboutStatCard({
  end,
  suffix = "",
  label,
  icon,
  className,
  duration = 1.6,
}: AboutStatCardProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const display = useCountUp(
    end,
    isInView,
    reduceMotion === true,
    duration,
  );

  return (
    <article
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-4 text-center shadow-lg backdrop-blur-md",
        className,
      )}
    >
      {icon ? (
        <div className="mb-2 text-[var(--color-accent)]">{icon}</div>
      ) : null}
      <p className="text-xl font-bold tabular-nums text-[var(--color-ink)]">
        {display}
        {suffix}
      </p>
      <p className="mt-1 text-[0.65rem] leading-snug font-medium uppercase tracking-wide text-[var(--color-muted)]">
        {label}
      </p>
    </article>
  );
}
