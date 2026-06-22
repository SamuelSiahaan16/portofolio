import type { SectionId } from "@/config/site";

/** Teks brand hero — edit di sini saja. */
export const BRAND = {
  heroText: "JEFF.DEV",
} as const;

export type SectionCopy = {
  label: string;
  description?: string;
};

/** Label & deskripsi tiap section — dipakai dock, nav, dan section shell. */
export const SECTION_COPY: Record<SectionId, SectionCopy> = {
  hero: { label: "Beranda" },
  about: {
    label: "Tentang",
    description: "Cerita singkat, fokus kerja, dan apa yang kamu tawarkan.",
  },
  projects: {
    label: "Proyek",
    description: "Highlight 3-5 karya terbaik dengan link demo/repo.",
  },
  skills: {
    label: "Keahlian",
    description: "Stack, tools, dan area kekuatan yang relevan untuk role target.",
  },
  experience: {
    label: "Pengalaman",
    description: "Timeline kerja, internship, atau kontribusi penting.",
  },
  contact: {
    label: "Kontak",
    description: "Satu jalur jelas untuk hiring manager atau klien menghubungi kamu.",
  },
};

/** Meta situs — nama, title tab, deskripsi SEO. */
export const SITE_META = {
  name: "Nama Kamu",
  title: "Nama Kamu — Portfolio",
  description: "Deskripsi singkat portfolio. Ganti dengan copy kamu.",
  locale: "id",
} as const;
