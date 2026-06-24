import { SECTION_COPY, SITE_META } from "@/config/copy";

export type SectionId =
  | "hero"
  | "about"
  | "experience"
  | "skills"
  | "projects"
  | "contact";

export type NavItem = {
  id: SectionId;
  label: string;
};

export type SiteMeta = {
  name: string;
  title: string;
  description: string;
  locale: string;
};

export type SiteConfig = {
  meta: SiteMeta;
  navigation: NavItem[];
  /** Urutan section di halaman (scroll satu halaman panjang). */
  sections: SectionId[];
};

const sections: SectionId[] = [
  "hero",
  "about",
  "skills",
  "experience",
  "projects",
  "contact",
];

/** Section yang mengatur layout sendiri (full bleed, tanpa wrapper Container). */
export const fullWidthSectionIds: SectionId[] = [
  "hero",
  "about",
  "skills",
  "contact",
];

/**
 * Edit urutan section di sini; label & deskripsi di `config/copy.ts`.
 */
export const siteConfig: SiteConfig = {
  meta: SITE_META,
  navigation: sections
    .filter((id): id is Exclude<SectionId, "hero"> => id !== "hero")
    .map((id) => ({
      id,
      label: SECTION_COPY[id].label,
    })),
  sections,
};
