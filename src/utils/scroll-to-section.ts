import type { SectionId } from "@/config/site";

export function scrollToSection(
  id: SectionId,
  behavior: ScrollBehavior = "smooth",
) {
  const el = document.getElementById(id);
  if (!el) return;

  el.scrollIntoView({ behavior, block: "start" });
}
