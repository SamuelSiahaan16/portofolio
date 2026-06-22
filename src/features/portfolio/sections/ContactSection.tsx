import { SectionShell } from "@/components/ui/SectionShell";
import { SECTION_COPY } from "@/config/copy";

export function ContactSection() {
  const { label, description } = SECTION_COPY.contact;

  return <SectionShell id="contact" title={label} description={description} />;
}
