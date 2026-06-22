import { DottedSurface } from "@/components/ui/dotted-surface";
import { SECTION_COPY } from "@/config/copy";
import { zIndex } from "@/config/z-index";
import { HeroBrand } from "@/features/portfolio/sections/HeroBrand";

export function HeroSection() {
  return (
    <section
      id="hero"
      aria-label={SECTION_COPY.hero.label}
      className="snap-section relative -mt-28 min-h-[100dvh] w-full overflow-hidden"
    >
      <DottedSurface className="min-h-[100dvh] w-full" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[var(--color-bg)]"
        style={{ zIndex: zIndex.base + 1 }}
      />
      <HeroBrand />
    </section>
  );
}
