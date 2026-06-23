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
  hero: { label: "Home" },
  about: {
    label: "About Me",
    description: "Senang mengeksplorasi hal-hal baru, mengembangkan aplikasi dan website, serta mengubah ide menjadi solusi digital yang berguna dan mudah digunakan. Terus belajar dan menambah pengalaman untuk menciptakan portofolio yang menarik, profesional, dan relevan dengan kebutuhan industri.",
  },
  projects: {
    label: "Projects",
    description: "Highlight 3-5 karya terbaik dengan link demo/repo.",
  },
  skills: {
    label: "Skills",
    description: "",
  },
  experience: {
    label: "Experience",
    description: "Timeline kerja, internship, atau kontribusi penting.",
  },
  contact: {
    label: "Contact",
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

/** Animasi judul section — Shuffle (React Bits / GSAP). */
export const SECTION_TITLE = {
  shuffleDirection: "down" as const,
  duration: 1.5,
  animationMode: "evenodd" as const,
  shuffleTimes: 2,
  ease: "power2.out",
  stagger: 0.16,
  threshold: 0.1,
  rootMargin: "-80px",
  triggerOnce: true,
  triggerOnHover: true,
  respectReducedMotion: true,
} as const;

/** Section Tentang — latar FaultyTerminal + profile card. */
export const ABOUT = {
  overlayOpacity: 0.52,
  terminal: {
    scale: 2.8,
    gridMul: [2, 1] as const,
    digitSize: 1.2,
    timeScale: 1,
    scanlineIntensity: 1,
    glitchAmount: 1,
    flickerAmount: 1,
    noiseAmp: 0.6,
    chromaticAberration: 0,
    dither: 0,
    curvature: 0.23,
    tint: "#fc0006",
    mouseReact: true,
    mouseStrength: 0.5,
    pageLoadAnimation: false,
    brightness: 1,
  },
  profile: {
    name: "",
    title: "",
    handle: "jefff.sh",
    status: "Online",
    contactText: "Contact Me",
    avatarUrl: "/about/picture.png",
    iconUrl: "/about/icon-pattern.svg",
    showUserInfo: true,
    enableTilt: true,
    enableMobileTilt: false,
    behindGlowEnabled: true,
    behindGlowColor: "rgba(120, 200, 255, 0.3)",
    behindGlowSize: "48%",
    innerGradient:
      "linear-gradient(160deg, #141c2b 0%, #101722 48%, #0a0f18 100%)",
  },
  actions: {
    cvUrl: "/cv/cv.pdf",
    cvLabel: "Download CV",
    projectsLabel: "View Projects",
  },
  education: [
    {
      badge: "Lulus",
      degree: "D3 Teknologi Informasi",
      institution: "Institut Teknologi Del", 
      gpa: "4.00/4.00"
    },
    {
      badge: "Berjalan",
      degree: "S1",
      institution: "Binus University", 
      gpa: "3.50/4.00"
    },
  ],
  stats: [
    { end: 10, suffix: "+", label: "Projects" },
    { end: 3, suffix: "+", label: "Tahun" },
    { end: 15, suffix: "+", label: "Tech Stack" },
  ],
} as const;

/** Section Skills — latar InteractiveGridBackground + beam diagram. */
export const SKILLS = {
  overlayOpacity: 0.28,
  grid: {
    gridSize: 50,
    gridColor: "#cbcbcb",
    darkGridColor: "#303030",
    effectColor: "rgba(0, 0, 0, 0.6)",
    darkEffectColor: "rgba(255, 255, 255, 0.6)",
    trailLength: 3,
    idleSpeed: 0.2,
    glow: true,
    glowRadius: 20,
    showFade: true,
    fadeIntensity: 20,
    idleRandomCount: 5,
  },
  beam: {
    gradientStartColor: "#78c8ff",
    gradientStopColor: "#6366f1",
    pathColor: "var(--color-border)",
    pathWidth: 2,
    pathOpacity: 0.55,
    duration: 5,
  },
  orbit: {
    minRadius: 34,
    maxRadius: 47,
    floatAmplitude: 2.8,
    nodeCollisionRadius: 6.8,
    centerCollisionRadius: 9.5,
  },
  center: {
    icon: "gcp-stackdriver" as const,
    label: "",
  },
  items: [
    { icon: "cursor" as const, label: "Cursor" },
    { icon: "html5" as const, label: "HTML5" },
    { icon: "javascript" as const, label: "JavaScript" },
    { icon: "css" as const, label: "CSS" },
    { icon: "python" as const, label: "Python" },
    { icon: "django" as const, label: "Django" },
    { icon: "laravel" as const, label: "Laravel" },
    { icon: "php" as const, label: "PHP" },
    { icon: "git" as const, label: "Git" },
    { icon: "react" as const, label: "React" },
    { icon: "docker" as const, label: "Docker" },
    { icon: "supabase" as const, label: "Supabase" },
    { icon: "postgresql" as const, label: "PostgreSQL" },
    { icon: "typescript" as const, label: "TypeScript" },
    { icon: "tailwind-css" as const, label: "Tailwind" },
  ],
} as const;
