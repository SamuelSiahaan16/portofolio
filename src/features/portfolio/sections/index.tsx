import type { ReactElement } from "react";
import type { SectionId } from "@/config/site";
import { AboutSection } from "./AboutSection";
import { ContactSection } from "./ContactSection";
import { ExperienceSection } from "./ExperienceSection";
import { HeroSection } from "./HeroSection";
import { ProjectsSection } from "./ProjectsSection";
import { SkillsSection } from "./SkillsSection";

const sectionMap = {
  hero: HeroSection,
  about: AboutSection,
  projects: ProjectsSection,
  skills: SkillsSection,
  experience: ExperienceSection,
  contact: ContactSection,
} as const satisfies Record<SectionId, () => ReactElement>;

export function renderSection(id: SectionId) {
  const Section = sectionMap[id];
  return <Section key={id} />;
}

export { sectionMap };
