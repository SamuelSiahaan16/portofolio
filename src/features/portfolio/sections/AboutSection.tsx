import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { AboutInfoCard, AboutStatCard } from "@/components/ui/about-info-card";
import { Btn3DAnchor, Btn3DButton } from "@/components/ui/btn-3d";
import { FaultyTerminal } from "@/components/ui/faulty-terminal";
import { ProfileCard } from "@/components/ui/profile-card";
import { Container } from "@/components/ui/Container";
import {
  SectionBackdropReveal,
  SectionReveal,
} from "@/components/ui/section-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ABOUT, SECTION_COPY } from "@/config/copy";
import { scrollToSection } from "@/utils/scroll-to-section";

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { label, description } = SECTION_COPY.about;
  const reduceMotion = useReducedMotion();
  const { terminal, overlayOpacity, profile, actions, education, stats } =
    ABOUT;
  const sectionInView = useInView(sectionRef, {
    amount: 0.2,
    margin: "-6% 0px -6% 0px",
  });

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-heading"
      className="snap-section relative min-h-[100dvh] overflow-hidden"
    >
      <SectionBackdropReveal sectionRef={sectionRef} className="absolute inset-0 z-0">
        <FaultyTerminal
          className="size-full"
          mouseRootRef={sectionRef}
          {...terminal}
          pause={reduceMotion === true}
        />
        <motion.div
          className="pointer-events-none absolute inset-0 bg-[var(--color-bg)]"
          initial={false}
          animate={{ opacity: overlayOpacity }}
          transition={{ duration: 0.5 }}
        />
      </SectionBackdropReveal>

      <Container className="relative z-[1] flex min-h-[100dvh] items-center pt-28 pb-[var(--spacing-section)]">
        <div className="grid w-full items-start gap-10 lg:grid-cols-2 lg:items-center lg:gap-14 xl:gap-16">
          <div className="flex w-full flex-col items-center gap-5">
            <SectionReveal
              active={sectionInView}
              direction="left"
              delay={0.04}
              distance={36}
              blur={false}
              className="w-full flex justify-center"
            >
              <ProfileCard
                className="w-[min(100%,22rem)]"
                {...profile}
                enableTilt={profile.enableTilt && reduceMotion !== true}
                onContactClick={() => scrollToSection("contact")}
              />
            </SectionReveal>

            <div className="grid w-full max-w-[min(100%,22rem)] grid-cols-3 gap-3">
              {stats.map((stat, index) => (
                <SectionReveal
                  key={stat.label}
                  active={sectionInView}
                  direction="up"
                  delay={0.14 + index * 0.07}
                  distance={18}
                  blur={false}
                  scale
                >
                  <AboutStatCard
                    end={stat.end}
                    suffix={stat.suffix}
                    label={stat.label}
                  />
                </SectionReveal>
              ))}
            </div>
          </div>

          <div className="max-w-xl">
            <SectionReveal active={sectionInView} direction="right" delay={0.06} distance={32}>
              <SectionHeading id="about-heading" title={label} />
              {description ? (
                <p className="text-pretty mt-3 text-[var(--color-muted)]">
                  {description}
                </p>
              ) : null}
            </SectionReveal>

            <SectionReveal
              active={sectionInView}
              className="mt-8 flex flex-wrap items-center gap-3"
              direction="up"
              delay={0.16}
              distance={20}
            >
              <Btn3DAnchor href={actions.cvUrl} download variant="destructive">
                {actions.cvLabel}
              </Btn3DAnchor>
              <Btn3DButton
                type="button"
                variant="primary"
                onClick={() => scrollToSection("projects")}
              >
                {actions.projectsLabel}
              </Btn3DButton>
            </SectionReveal>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {education.map((item, index) => (
                <SectionReveal
                  key={item.institution}
                  active={sectionInView}
                  direction="up"
                  delay={0.22 + index * 0.1}
                  distance={24}
                  scale
                >
                  <AboutInfoCard
                    badge={item.badge}
                    subtitle={item.degree}
                    title={item.institution}
                    description={item.gpa}
                  />
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
