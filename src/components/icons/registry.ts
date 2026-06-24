import type { ComponentType, SVGProps } from "react";
import Css from "@thesvg/react/css";
import Docker from "@thesvg/react/docker";
import Educative from "@thesvg/react/educative";
import Exercism from "@thesvg/react/exercism";
import Gmail from "@thesvg/react/gmail";
import GcpHome from "@thesvg/react/gcp-home";
import Git from "@thesvg/react/git";
import Gravatar from "@thesvg/react/gravatar";
import Html5 from "@thesvg/react/html5";
import Instagram from "@thesvg/react/instagram";
import JavaScript from "@thesvg/react/javascript";
import Laravel from "@thesvg/react/laravel";
import Linkedin from "@thesvg/react/linkedin";
import Livechat from "@thesvg/react/livechat";
import Php from "@thesvg/react/php";
import Python from "@thesvg/react/python";
import ReactIcon from "@thesvg/react/react";
import Supabase from "@thesvg/react/supabase";
import TailwindCss from "@thesvg/react/tailwind-css";
import Tiktok from "@thesvg/react/tiktok";
import TypeScript from "@thesvg/react/typescript";
import {
  CursorIcon,
  DjangoIcon,
  GcpStackdriverIcon,
  PostgreSqlIcon,
} from "@/components/icons/fixed-icons";

/**
 * Satu-satunya sumber icon di project ini: https://thesvg.org/
 * Tambah icon baru lewat import individual `@thesvg/react/<slug>`.
 */
export type TheSvgIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export const theSvgIcons = {
  "gcp-home": GcpHome,
  gravatar: Gravatar,
  educative: Educative,
  "gcp-stackdriver": GcpStackdriverIcon,
  exercism: Exercism,
  livechat: Livechat,
  cursor: CursorIcon,
  html5: Html5,
  javascript: JavaScript,
  css: Css,
  python: Python,
  django: DjangoIcon,
  laravel: Laravel,
  php: Php,
  git: Git,
  gmail: Gmail,
  instagram: Instagram,
  linkedin: Linkedin,
  react: ReactIcon,
  tiktok: Tiktok,
  docker: Docker,
  supabase: Supabase,
  postgresql: PostgreSqlIcon,
  typescript: TypeScript,
  "tailwind-css": TailwindCss,
} as const;

export type TheSvgIconName = keyof typeof theSvgIcons;
