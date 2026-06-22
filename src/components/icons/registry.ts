import type { ComponentType, SVGProps } from "react";
import Educative from "@thesvg/react/educative";
import Exercism from "@thesvg/react/exercism";
import GcpHome from "@thesvg/react/gcp-home";
import Gravatar from "@thesvg/react/gravatar";
import Livechat from "@thesvg/react/livechat";
import { GcpStackdriverIcon } from "@/components/icons/fixed-icons";

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
} as const;

export type TheSvgIconName = keyof typeof theSvgIcons;
