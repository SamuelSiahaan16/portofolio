import { SectionShell } from "@/components/ui/SectionShell";
import { SECTION_COPY } from "@/config/copy";

export function AboutSection() {
  const { label, description } = SECTION_COPY.about;

  return (
    <SectionShell
      id="about"
      title={label}
      description={description}
      className="min-h-[80dvh]"
    />
  );
}
