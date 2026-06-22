import type { SectionId } from "@/config/site";
import { siteConfig } from "@/config/site";

/** Urutan scroll presentasi: section halaman + footer penutup. */
export type ScrollTarget = SectionId | "footer";

export const scrollTargets: ScrollTarget[] = [
  ...siteConfig.sections,
  "footer",
];

export function getScrollTargetIndex(target: ScrollTarget) {
  return scrollTargets.indexOf(target);
}

export function resolveScrollTarget(
  activeSection: SectionId,
  footerInView: boolean,
): ScrollTarget {
  return footerInView ? "footer" : activeSection;
}
