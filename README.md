# my-portofolio

Portfolio pribadi single-page dengan nuansa macOS — hero interaktif, dock navigation mengambang, dan section scroll yang rapi. Dibangun untuk mudah dikustomisasi: ubah teks di satu file, tambah section lewat config, tanpa routing hash.

---

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Technology Stack](#technology-stack)
- [Arsitektur](#arsitektur)
- [Memulai](#memulai)
- [Struktur Proyek](#struktur-proyek)
- [File Penting](#file-penting)
- [Kustomisasi Konten](#kustomisasi-konten)
- [Workflow Development](#workflow-development)
- [Standar Kode](#standar-kode)
- [Scripts](#scripts)

---

## Fitur Utama

| Area | Deskripsi |
|------|-----------|
| **Hero** | Background `DottedSurface` (Three.js), brand `JEFF.DEV` dengan animasi `RevealText` + hover pattern |
| **Dock Nav** | Navbar gaya macOS dock — ikon dari [theSVG](https://thesvg.org), magnification on hover, tooltip label |
| **Smart placement** | Dock di tengah saat di hero, naik ke atas saat scroll ke section lain |
| **Active section** | `IntersectionObserver` menyorot section aktif; tombol dock ke section aktif disembunyikan |
| **Section Pager** | Panah atas/bawah kanan bawah — navigasi presentasi antar section + footer; auto-hide saat mouse idle |
| **Scroll snap hybrid** | `scroll-snap` proximity untuk scroll bebas di section panjang; panah/dock lompat ketat per section |
| **Footer** | Full viewport (`100dvh`) — latar `FallingPattern` bintik hijau, teks **THANK YOU** + copyright, layer `InkReveal` (coret untuk membuka teks) |
| **Dock hide di footer** | Saat footer terlihat ≥35%, dock disembunyikan lewat `useFooterInView` |
| **Single-page scroll** | Satu route `/`, navigasi smooth scroll tanpa hash URL |
| **Copy terpusat** | Semua label, deskripsi, meta situs, dan config footer di `src/config/copy.ts` |
| **A11y & motion** | `prefers-reduced-motion`, `aria-label`, scrollbar native disembunyikan |

---

## Technology Stack

| Kategori | Teknologi |
|----------|-----------|
| Runtime | React 19, TypeScript 5.8 |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Routing | React Router DOM 7 |
| Animasi | Motion 12 |
| 3D | Three.js |
| Ikon | [@thesvg/react](https://thesvg.org) |
| UI pattern | shadcn-style (`components.json`, alias `@/`) |
| Lint | ESLint 9 + typescript-eslint |

---

## Arsitektur

```mermaid
flowchart TB
  subgraph entry [Entry]
    main["main.tsx"]
    App["App.tsx"]
    router["router.tsx"]
  end

  subgraph layout [Layout]
    MainLayout["MainLayout"]
    DockCtx["DockPlacementContext"]
    SiteDock["SiteDockNav → DockTabs"]
    SectionPager["SectionPager"]
    Footer["SiteFooter"]
  end

  subgraph page [Page]
    HomePage["HomePage"]
    Hero["HeroSection"]
    Sections["About · Projects · Skills · Experience · Contact"]
  end

  subgraph config [Config]
    copy["copy.ts"]
    site["site.ts"]
    dockNav["dock-nav.ts"]
    scrollTargets["scroll-targets.ts"]
  end

  main --> App --> router
  router --> MainLayout
  MainLayout --> DockCtx
  MainLayout --> SiteDock
  MainLayout --> SectionPager
  MainLayout --> HomePage
  MainLayout --> Footer
  HomePage --> Hero
  HomePage --> Sections
  site --> HomePage
  copy --> site
  copy --> dockNav
  copy --> Sections
  dockNav --> SiteDock
  scrollTargets --> SectionPager
```

**Alur singkat**

1. `siteConfig.sections` menentukan urutan section di halaman.
2. `HomePage` merender section via `renderSection()` — hero full-width, sisanya di dalam `Container`.
3. `DockPlacementContext` memantau posisi hero dan mengatur dock `center` ↔ `top`.
4. `useActiveSection` mendeteksi section yang terlihat; `dock-tabs` menyembunyikan item aktif.
5. **Dua navigasi scroll** — dock (lompat langsung) + `SectionPager` (prev/next berurutan). Keduanya memakai `scroll-to-section.ts`.
6. Urutan pager: hero → about → … → contact → **footer** (`scroll-targets.ts`).
7. `SiteFooter` menumpuk tiga layer: `FallingPattern` (latar animasi) → teks penutup → `InkReveal` (canvas scratch di atas).
8. `useFooterInView` memantau `#footer`; saat masuk viewport, dock di-`AnimatePresence` keluar.

---

## Memulai

### Prasyarat

- Node.js 20+
- npm (atau pnpm/yarn)

### Instalasi & menjalankan

```bash
# Clone & masuk ke folder proyek
cd my-portofolio

# Install dependensi
npm install

# Development server
npm run dev

# Build production
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```

Buka `http://localhost:5173` setelah `npm run dev`.

---

## Struktur Proyek

```
my-portofolio/
├── components.json          # Konfigurasi shadcn (alias, Tailwind, icon library)
├── package.json
├── vite.config.ts           # Alias @/, optimizeDeps (three, thesvg)
├── tsconfig.json
│
└── src/
    ├── main.tsx             # Entry React
    ├── App.tsx              # RouterProvider
    ├── router.tsx           # Route tunggal: /
    │
    ├── config/
    │   ├── copy.ts          # ★ Semua teks tetap (brand, section, meta SEO)
    │   ├── site.ts          # Urutan section, navigation, meta
    │   ├── dock-nav.ts      # Mapping icon dock per section
    │   ├── scroll-targets.ts # Urutan scroll pager (section + footer)
    │   └── z-index.ts       # Layering (dock, pager, hero brand, dll.)
    │
    ├── contexts/
    │   └── DockPlacementContext.tsx   # State center/top dock + hysteresis scroll
    │
    ├── hooks/
    │   ├── useActiveSection.ts        # IntersectionObserver section aktif
    │   ├── useFooterInView.ts         # Sembunyikan dock saat footer terlihat
    │   ├── usePointerActivity.ts      # Deteksi gerakan mouse untuk show/hide pager
    │   └── useColorScheme.ts          # prefers-color-scheme untuk Three.js
    │
    ├── layouts/
    │   ├── MainLayout.tsx             # Shell: dock + outlet + footer
    │   ├── SiteDockNav.tsx            # Wrapper dock + activeId
    │   └── SiteFooter.tsx
    │
    ├── pages/
    │   └── HomePage.tsx               # Orchestrator semua section
    │
    ├── features/portfolio/sections/
    │   ├── index.tsx                  # sectionMap + renderSection()
    │   ├── HeroSection.tsx            # DottedSurface + HeroBrand
    │   ├── HeroBrand.tsx              # RevealText brand
    │   ├── AboutSection.tsx
    │   ├── ProjectsSection.tsx
    │   ├── SkillsSection.tsx
    │   ├── ExperienceSection.tsx
    │   └── ContactSection.tsx
    │
    ├── components/
    │   ├── icons/
    │   │   ├── registry.ts            # Daftar icon theSVG yang dipakai
    │   │   ├── fixed-icons.tsx        # Patch SVG tanpa fill (Stackdriver)
    │   │   ├── TheSvgIcon.tsx         # Renderer icon
    │   │   └── index.ts
    │   └── ui/
    │       ├── dock-tabs.tsx          # Dock macOS + AnimatePresence
    │       ├── section-pager.tsx      # Panah prev/next kanan bawah
    │       ├── reveal-text.tsx        # Animasi huruf per karakter
    │       ├── falling-pattern.tsx    # Partikel jatuh — `streaks` (hero) / `dots` (footer)
    │       ├── ink-reveal.tsx         # Canvas scratch-to-reveal di footer
    │       ├── dotted-surface.tsx     # Hero Three.js
    │       ├── SectionShell.tsx       # Wrapper section placeholder
    │       └── Container.tsx
    │
    ├── styles/
    │   └── index.css                  # Tailwind v4, CSS tokens, dark mode
    │
    └── utils/
        ├── scroll-to-section.ts       # Scroll programmatic + scroll lock (anti snap glitch)
        └── cn.ts                      # className helper
```

---

## File Penting

| File | Peran |
|------|-------|
| `src/config/copy.ts` | **Satu sumber teks** — `BRAND`, `SECTION_COPY`, `SITE_META`, `FOOTER` |
| `src/config/scroll-targets.ts` | Urutan target scroll pager (`sections` + `footer`) |
| `src/utils/scroll-to-section.ts` | `scrollToSection`, `scrollToAdjacent` — lock snap saat navigasi |
| `src/components/ui/section-pager.tsx` | Panah atas/bawah, idle hide, `inert` saat tersembunyi |
| `src/hooks/usePointerActivity.ts` | Show pager saat mouse/keyboard aktif (~2.2s idle) |
| `src/layouts/SiteFooter.tsx` | Komposisi footer: pattern, teks hover, ink layer |
| `src/components/ui/falling-pattern.tsx` | Animasi partikel CSS (`variant: "dots"` \| `"streaks"`) |
| `src/components/ui/ink-reveal.tsx` | Efek coret tinta di atas footer |
| `src/hooks/useFooterInView.ts` | Trigger sembunyikan dock saat scroll ke footer |
| `src/config/site.ts` | Urutan section & struktur navigasi |
| `src/config/dock-nav.ts` | Icon dock per section (slug theSVG) |
| `src/components/ui/dock-tabs.tsx` | UI dock, hide active item, tooltip |
| `src/contexts/DockPlacementContext.tsx` | Logika posisi dock saat scroll |
| `src/features/portfolio/sections/index.tsx` | Registry komponen section |

---

## Kustomisasi Konten

### Ganti teks brand & section

Edit **`src/config/copy.ts`**:

```ts
export const BRAND = {
  heroText: "JEFF.DEV",  // ← nama di hero
};

export const SECTION_COPY = {
  about: {
    label: "Tentang",
    description: "Cerita singkat...",
  },
  // ...
};

export const SITE_META = {
  name: "Nama Kamu",
  title: "Nama Kamu — Portfolio",
  description: "Deskripsi SEO...",
  locale: "id",
};
```

### Footer — teks, pattern, dan ink reveal

Edit **`FOOTER`** di `src/config/copy.ts`:

```ts
export const FOOTER = {
  thankYouText: "THANK YOU",
  pattern: {
    variant: "dots",       // "dots" = bintik bulat jatuh | "streaks" = garis vertikal (dipakai hero hover)
    color: "#2ee88a",      // warna partikel
    duration: 48,          // detik satu siklus animasi
    density: 3.5,          // kerapatan overlay (mode streaks)
    blurIntensity: "0.32rem",
    scale: 1.85,           // zoom pattern di SiteFooter
  },
  darkMaskColor: [22, 22, 28],    // RGB mask ink — dark mode
  lightMaskColor: [248, 248, 252], // RGB mask ink — light mode
};
```

**Perilaku footer**

- **Latar belakang** — `FallingPattern` dengan `variant="dots"`: bintik hijau jatuh ke bawah (bukan garis).
- **Teks** — `thankYouText` + copyright muncul saat hover footer (atau langsung terlihat jika `prefers-reduced-motion`).
- **Ink reveal** — layer canvas di atas; user menggeser kursor untuk “mengupas” tinta dan melihat teks di bawahnya. Brush size & lifetime diatur di `SiteFooter.tsx` (`brushSize`, `lifetime`).
- **Dock** — otomatis hilang saat footer cukup terlihat di viewport.

Hero hover brand tetap memakai `FallingPattern` mode **`streaks`** lewat `RevealText` (`background-clip: text`).

### Navigasi scroll — dock & section pager

Portfolio punya **dua cara navigasi** yang saling melengkapi:

| Navigasi | Lokasi | Perilaku |
|----------|--------|----------|
| **Dock** | Atas (tengah/atas saat scroll) | Lompat langsung ke section mana pun |
| **Section Pager** | Kanan bawah | Naik/turun satu section berurutan |

**Urutan pager** mengikuti `scrollTargets` di `src/config/scroll-targets.ts`:

```
hero → about → projects → skills → experience → contact → footer
```

**Scroll snap hybrid**

- **Mouse/trackpad** — scroll bebas; section panjang bisa di-scroll di dalamnya. Saat berhenti, `scroll-snap-type: y proximity` mengunci dekat awal section.
- **Panah / dock** — lompat ketat ke awal section berikutnya. Snap sementara dimatikan (`is-scroll-navigating`) supaya tidak “balik” ke posisi tengah.
- **Hero** — navigasi programmatic selalu ke `top: 0` (full layar).

**Section Pager — visibilitas**

- Muncul saat mouse bergerak atau keyboard ditekan.
- Hilang otomatis setelah ~2.2 detik tanpa aktivitas (`usePointerActivity`).
- Saat tersembunyi: `opacity: 0`, `inert`, `tabIndex={-1}` (tanpa error a11y).

**Kustomisasi idle pager** — ubah timeout di `usePointerActivity(idleMs)` dari `section-pager.tsx`.

### Ganti icon dock

Edit mapping di **`src/config/dock-nav.ts`**, lalu daftarkan import di **`src/components/icons/registry.ts`**. Cari slug di [thesvg.org](https://thesvg.org).

### Tambah / ubah urutan section

1. Tambah `SectionId` di `src/config/site.ts`
2. Tambah entry di `SECTION_COPY` (`copy.ts`)
3. Buat komponen section di `features/portfolio/sections/`
4. Daftarkan di `sectionMap` (`sections/index.tsx`)
5. Tambah icon di `dock-nav.ts` + `registry.ts`

---

## Workflow Development

1. Jalankan `npm run dev` — hot reload via Vite.
2. Ubah copy di `copy.ts` untuk teks; layout di komponen section masing-masing.
3. Komponen UI reusable taruh di `src/components/ui/`.
4. Config & constant taruh di `src/config/`, hindari string duplikat di banyak file.
5. Sebelum deploy: `npm run build` → `npm run preview` untuk cek production build.

---

## Standar Kode

- **TypeScript strict** — tipe eksplisit untuk config & props.
- **Alias `@/`** — import dari `src/` (lihat `vite.config.ts` & `tsconfig`).
- **Feature folders** — section portfolio di `features/portfolio/`.
- **Single source of truth** — urutan section (`site.ts`), teks (`copy.ts`), icon (`dock-nav.ts` + `registry.ts`).
- **Motion** — hormati `useReducedMotion()` untuk animasi non-esensial.
- **Ikon** — hanya via `@thesvg/react` + `TheSvgIcon`; patch SVG rusak di `fixed-icons.tsx`.

---

## Scripts

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Dev server Vite |
| `npm run build` | Typecheck + bundle production → `dist/` |
| `npm run preview` | Serve folder `dist/` lokal |
| `npm run lint` | ESLint seluruh proyek |

---

