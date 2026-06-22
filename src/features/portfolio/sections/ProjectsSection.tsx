import { SectionShell } from "@/components/ui/SectionShell";
import { SECTION_COPY } from "@/config/copy";

export function ProjectsSection() {
  const { label, description } = SECTION_COPY.projects;

  return (
    <SectionShell id="projects" title={label} description={description} />
  );
}
