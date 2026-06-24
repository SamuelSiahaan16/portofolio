import { useState, type FormEvent } from "react";
import { Btn3DButton } from "@/components/ui/btn-3d";
import {
  ElectricBorder,
  type ElectricBorderProps,
} from "@/components/ui/electric-border";
import { cn } from "@/lib/utils";

export type ContactFormField = {
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
  submitLabel: string;
  successMessage: string;
};

type ContactFormProps = {
  fields: ContactFormField;
  electricBorder: Pick<
    ElectricBorderProps,
    "color" | "speed" | "chaos" | "borderRadius"
  >;
  paused?: boolean;
  className?: string;
};

const inputClassName =
  "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/60 px-4 py-3 text-sm text-[var(--color-ink)] transition-[border-color,box-shadow] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/25";

const panelClassName =
  "h-full rounded-2xl bg-[var(--color-surface)]/88 p-5 shadow-sm backdrop-blur-md sm:p-7";

export function ContactForm({
  fields,
  electricBorder,
  paused = false,
  className,
}: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const borderProps = {
    ...electricBorder,
    paused,
    className: cn("h-full w-full", className),
    style: { borderRadius: electricBorder.borderRadius },
  };

  if (submitted) {
    return (
      <ElectricBorder {...borderProps}>
        <div className={panelClassName} role="status">
          <p className="text-pretty text-sm leading-relaxed text-[var(--color-ink)]">
            {fields.successMessage}
          </p>
        </div>
      </ElectricBorder>
    );
  }

  return (
    <ElectricBorder {...borderProps}>
      <form
        onSubmit={handleSubmit}
        className={cn(panelClassName, "flex flex-col gap-4")}
        noValidate
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-[var(--color-ink)]">
              {fields.nameLabel}
            </span>
            <input
              type="text"
              name="name"
              autoComplete="name"
              required
              placeholder={fields.namePlaceholder}
              className={inputClassName}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-[var(--color-ink)]">
              {fields.emailLabel}
            </span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              placeholder={fields.emailPlaceholder}
              className={inputClassName}
            />
          </label>
        </div>

        <label className="grid flex-1 gap-2">
          <span className="text-sm font-medium text-[var(--color-ink)]">
            {fields.messageLabel}
          </span>
          <textarea
            name="message"
            required
            rows={5}
            placeholder={fields.messagePlaceholder}
            className={cn(inputClassName, "min-h-[8.5rem] flex-1 resize-y")}
          />
        </label>

        <div className="flex justify-end pt-1">
          <Btn3DButton type="submit" variant="primary">
            {fields.submitLabel}
          </Btn3DButton>
        </div>
      </form>
    </ElectricBorder>
  );
}
