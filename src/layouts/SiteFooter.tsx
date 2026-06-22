import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { FallingPattern } from "@/components/ui/falling-pattern";
import { InkReveal } from "@/components/ui/ink-reveal";
import { FOOTER, SITE_META } from "@/config/copy";
import { useColorScheme } from "@/hooks/useColorScheme";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const reduceMotion = useReducedMotion();
  const colorScheme = useColorScheme();
  const maskColor =
    colorScheme === "dark"
      ? FOOTER.darkMaskColor
      : FOOTER.lightMaskColor;
  const [isHovering, setIsHovering] = useState(false);
  const showText = isHovering || reduceMotion === true;
  const { pattern } = FOOTER;

  return (
    <footer
      id="footer"
      aria-label="Penutup"
      className="snap-section relative min-h-[100dvh] w-full overflow-hidden bg-[var(--color-bg)]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div aria-hidden className="absolute inset-0 z-0 w-full overflow-hidden">
        <div
          className="absolute inset-0 w-full origin-top"
          style={{ transform: `scale(${pattern.scale})` }}
        >
          <FallingPattern
            className="h-full min-h-[100dvh] w-full"
            variant={pattern.variant}
            color={pattern.color}
            backgroundColor="var(--color-bg)"
            duration={pattern.duration}
            density={pattern.density}
            blurIntensity={pattern.blurIntensity}
            animate={reduceMotion !== true}
          />
        </div>
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] flex min-h-[100dvh] w-full flex-col items-center justify-center px-6 text-center">
        <motion.p
          className="text-balance text-[clamp(2.5rem,12vw,6.5rem)] font-black tracking-[0.18em] text-[var(--color-ink)]"
          initial={false}
          animate={{ opacity: showText ? 1 : 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.25,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {FOOTER.thankYouText}
        </motion.p>
        <motion.p
          className="mt-10 text-sm tracking-wide text-[var(--color-muted)]"
          initial={false}
          animate={{ opacity: showText ? 1 : 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.25,
            delay: reduceMotion ? 0 : 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          © {year} {SITE_META.name}
        </motion.p>
      </div>

      <InkReveal
        maskColor={maskColor}
        brushSize={132}
        lifetime={720}
        disabled={reduceMotion === true}
        className="z-[2]"
      />
    </footer>
  );
}
