import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import "./btn-3d.css";

const variantClass = {
  destructive: "btn-3d-destructive",
  primary: "btn-3d-primary",
} as const;

type Btn3DVariant = keyof typeof variantClass;

type Btn3DAnchorProps = ComponentPropsWithoutRef<"a"> & {
  variant?: Btn3DVariant;
  children: ReactNode;
};

type Btn3DButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: Btn3DVariant;
  children: ReactNode;
};

function Btn3DFace({ children }: { children: ReactNode }) {
  return (
    <>
      <span className="btn-3d__shadow" aria-hidden />
      <span className="btn-3d__edge" aria-hidden />
      <span className="btn-3d__front">{children}</span>
    </>
  );
}

export function Btn3DAnchor({
  variant = "destructive",
  className,
  children,
  ...props
}: Btn3DAnchorProps) {
  return (
    <a
      className={cn("btn-3d", variantClass[variant], className)}
      {...props}
    >
      <Btn3DFace>{children}</Btn3DFace>
    </a>
  );
}

export function Btn3DButton({
  variant = "destructive",
  className,
  children,
  type = "button",
  ...props
}: Btn3DButtonProps) {
  return (
    <button
      type={type}
      className={cn("btn-3d", variantClass[variant], className)}
      {...props}
    >
      <Btn3DFace>{children}</Btn3DFace>
    </button>
  );
}
