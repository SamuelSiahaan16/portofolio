import { TheSvgIcon, type TheSvgIconName } from "@/components/icons";
import { cn } from "@/lib/utils";

export type ContactLinkIcon = Extract<
  TheSvgIconName,
  "gmail" | "linkedin" | "instagram" | "tiktok"
>;

export type ContactSocialLink = {
  id: string;
  icon: ContactLinkIcon;
  ariaLabel: string;
  href: string;
  external?: boolean;
};

export type ContactSidebarContent = {
  title: string;
  paragraphs: readonly string[];
  links: readonly ContactSocialLink[];
};

type ContactSidebarProps = {
  content: ContactSidebarContent;
  className?: string;
};

const linkClassName =
  "flex size-12 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/35 transition-[border-color,background-color,transform] hover:scale-105 hover:border-[var(--color-accent)]/35 hover:bg-[var(--color-accent)]/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] sm:size-[3.25rem]";

export function ContactSidebar({ content, className }: ContactSidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full flex-col justify-between gap-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 p-5 backdrop-blur-sm sm:p-7",
        className,
      )}
    >
      <div className="space-y-4">
        <h3 className="text-xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-2xl">
          {content.title}
        </h3>
        {content.paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className="text-pretty text-sm leading-relaxed text-[var(--color-muted)] sm:text-[0.95rem]"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <ul className="flex flex-wrap items-center gap-3 sm:gap-4">
        {content.links.map((link) => (
          <li key={link.id}>
            <a
              href={link.href}
              aria-label={link.ariaLabel}
              title={link.ariaLabel}
              className={linkClassName}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              <TheSvgIcon name={link.icon} size={24} />
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
