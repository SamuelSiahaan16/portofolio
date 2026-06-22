import { SectionShell } from "@/components/ui/SectionShell";
import { SECTION_COPY } from "@/config/copy";

export function ExperienceSection() {
  const { label, description } = SECTION_COPY.experience;

  return (
    <SectionShell id="experience" title={label} description={description} />
  );
}
