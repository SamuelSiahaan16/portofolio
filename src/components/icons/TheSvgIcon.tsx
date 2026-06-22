import type { SVGProps } from "react";
import { cn } from "@/lib/utils";
import { theSvgIcons, type TheSvgIconName } from "./registry";

type TheSvgIconProps = SVGProps<SVGSVGElement> & {
  name: TheSvgIconName;
  size?: number;
};

export function TheSvgIcon({
  name,
  size = 24,
  width,
  height,
  className,
  ...props
}: TheSvgIconProps) {
  const Icon = theSvgIcons[name];

  return (
    <Icon
      width={width ?? size}
      height={height ?? size}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden={props["aria-label"] ? undefined : true}
      className={cn("block shrink-0", className)}
      {...props}
    />
  );
}

export type { TheSvgIconName };
