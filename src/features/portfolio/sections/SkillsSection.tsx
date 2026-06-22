import { SectionShell } from "@/components/ui/SectionShell";
import { SECTION_COPY } from "@/config/copy";

export function SkillsSection() {
  const { label, description } = SECTION_COPY.skills;

  return <SectionShell id="skills" title={label} description={description} />;
}
