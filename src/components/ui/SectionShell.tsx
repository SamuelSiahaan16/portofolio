import type { ReactNode } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/utils/cn";

type SectionShellProps = {
  id: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};

/**
 * Wrapper section untuk fase skeleton.
 * Nanti tiap section (Hero, About, dll.) punya layout sendiri.
 */
export function SectionShell({
  id,
  title,
  description,
  children,
  className,
}: SectionShellProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn(
        "snap-section flex min-h-[100dvh] w-full flex-col justify-center pt-28 pb-[var(--spacing-section)]",
        className,
      )}
    >
      <div className="w-full">
        <div className="mb-8 max-w-2xl">
          <SectionHeading id={`${id}-heading`} title={title} />
          {description ? (
            <p className="text-pretty mt-3 max-w-[65ch] text-[var(--color-muted)]">
              {description}
            </p>
          ) : null}
        </div>
        {children ?? (
          <div
            className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-sm text-[var(--color-muted)]"
            data-placeholder
          >
            Konten <strong>{title}</strong> akan diisi di fase berikutnya.
          </div>
        )}
      </div>
    </section>
  );
}
