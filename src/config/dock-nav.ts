import type { TheSvgIconName } from "@/components/icons";
import { SECTION_COPY } from "@/config/copy";
import type { SectionId } from "@/config/site";
import { siteConfig } from "@/config/site";

export type DockItemConfig = {
  id: SectionId;
  name: string;
  icon: TheSvgIconName;
};

const dockMeta: Record<SectionId, Pick<DockItemConfig, "icon">> = {
  hero: { icon: "gcp-home" },
  about: { icon: "gravatar" },
  projects: { icon: "educative" },
  skills: { icon: "gcp-stackdriver" },
  experience: { icon: "exercism" },
  contact: { icon: "livechat" },
};

/** Nav items yang tampil di dock — urutan mengikuti `siteConfig.sections`. */
export const dockItems: DockItemConfig[] = siteConfig.sections.map((id) => ({
  id,
  name: SECTION_COPY[id].label,
  icon: dockMeta[id].icon,
}));
