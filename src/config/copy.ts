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

/** Footer — teks penutup & latar falling pattern (ink reveal). */
export const FOOTER = {
  thankYouText: "THANK YOU",
  pattern: {
    variant: "dots" as const,
    color: "#2ee88a",
    duration: 48,
    density: 3.5,
    blurIntensity: "0.32rem",
    scale: 1.85,
  },
  /** RGB mask gelap — selaras dengan --color-bg dark */
  darkMaskColor: [22, 22, 28] as [number, number, number],
  lightMaskColor: [248, 248, 252] as [number, number, number],
} as const;
