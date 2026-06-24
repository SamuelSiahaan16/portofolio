import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ContactForm } from "@/components/ui/contact-form";
import { ContactSidebar } from "@/components/ui/contact-sidebar";
import { Container } from "@/components/ui/Container";
import { ShapeGrid } from "@/components/ui/shape-grid";
import { SectionBackdropReveal, SectionReveal } from "@/components/ui/section-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { CONTACT, SECTION_COPY } from "@/config/copy";

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { label, description } = SECTION_COPY.contact;
  const reduceMotion = useReducedMotion();
  const { shapeGrid, overlayOpacity, form, sidebar } = CONTACT;
  const { electricBorder, ...formFields } = form;
  const sectionInView = useInView(sectionRef, {
    amount: 0.2,
    margin: "-6% 0px -6% 0px",
  });

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="contact-heading"
      className="snap-section relative min-h-[100dvh] overflow-hidden"
    >
      <SectionBackdropReveal
        sectionRef={sectionRef}
        className="pointer-events-none absolute inset-0 z-0"
      >
        <ShapeGrid
          className="pointer-events-auto size-full"
          {...shapeGrid}
          paused={reduceMotion === true || sectionInView !== true}
        />
        <motion.div
          className="pointer-events-none absolute inset-0 bg-[var(--color-bg)]"
          initial={false}
          animate={{ opacity: overlayOpacity }}
          transition={{ duration: 0.5 }}
        />
      </SectionBackdropReveal>

      <Container className="pointer-events-none relative z-[1] flex min-h-[100dvh] flex-col justify-center gap-10 pt-28 pb-[var(--spacing-section)]">
        <SectionReveal
          active={sectionInView}
          direction="down"
          delay={0.04}
          distance={32}
          className="pointer-events-auto max-w-3xl"
        >
          <SectionHeading id="contact-heading" title={label} align="left" />
          {description ? (
            <p className="text-pretty mt-3 max-w-[65ch] text-[var(--color-muted)]">
              {description}
            </p>
          ) : null}
        </SectionReveal>

        <div className="pointer-events-none grid w-full grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-10 xl:gap-12">
          <SectionReveal
            active={sectionInView}
            direction="left"
            delay={0.1}
            distance={28}
            blur={false}
            className="pointer-events-auto flex"
          >
            <ContactForm
              fields={formFields}
              electricBorder={electricBorder}
              paused={reduceMotion === true || sectionInView !== true}
              className="h-full"
            />
          </SectionReveal>

          <SectionReveal
            active={sectionInView}
            direction="right"
            delay={0.14}
            distance={28}
            blur={false}
            className="pointer-events-auto flex"
          >
            <ContactSidebar content={sidebar} className="h-full w-full" />
          </SectionReveal>
        </div>
      </Container>
    </section>
  );
}
