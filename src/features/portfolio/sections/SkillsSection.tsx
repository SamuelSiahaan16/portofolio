import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { InteractiveGridBackground } from "@/components/ui/interactive-grid-background";
import {
  SectionBackdropReveal,
  SectionReveal,
} from "@/components/ui/section-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { SkillsBeam } from "@/components/ui/skills-beam";
import { SECTION_COPY, SKILLS } from "@/config/copy";

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { label, description } = SECTION_COPY.skills;
  const reduceMotion = useReducedMotion();
  const { grid, overlayOpacity, beam, orbit, center, items } = SKILLS;
  const sectionInView = useInView(sectionRef, {
    amount: 0.2,
    margin: "-6% 0px -6% 0px",
  });

  return (
    <section
      ref={sectionRef}
      id="skills"
      aria-labelledby="skills-heading"
      className="snap-section relative min-h-[100dvh] overflow-hidden"
    >
      <SectionBackdropReveal sectionRef={sectionRef} className="absolute inset-0 z-0">
        <InteractiveGridBackground
          className="size-full"
          {...grid}
          pause={reduceMotion === true || sectionInView !== true}
        />
        <motion.div
          className="pointer-events-none absolute inset-0 bg-[var(--color-bg)]"
          initial={false}
          animate={{ opacity: overlayOpacity }}
          transition={{ duration: 0.5 }}
        />
      </SectionBackdropReveal>

      <Container className="relative z-[1] flex min-h-[100dvh] flex-col items-center justify-center gap-10 pt-28 pb-[var(--spacing-section)]">
        <SectionReveal
          active={sectionInView}
          direction="down"
          delay={0.04}
          distance={32}
          className="mx-auto max-w-2xl text-center"
        >
          <SectionHeading id="skills-heading" title={label} align="center" />
          {description ? (
            <p className="text-pretty mx-auto mt-3 max-w-[65ch] text-[var(--color-muted)]">
              {description}
            </p>
          ) : null}
        </SectionReveal>

        <SectionReveal
          active={sectionInView}
          direction="up"
          delay={0.14}
          distance={36}
          blur={false}
          scale
          className="w-full"
        >
          <SkillsBeam
            center={center}
            items={[...items]}
            orbit={orbit}
            beam={beam}
            active={sectionInView}
            className="w-full"
          />
        </SectionReveal>
      </Container>
    </section>
  );
}
