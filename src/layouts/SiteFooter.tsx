import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] py-10">
      <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--color-muted)]">
          © {year} {siteConfig.meta.name}
        </p>
        <p className="text-sm text-[var(--color-muted)]">
          Skeleton portfolio — konten menyusul per section.
        </p>
      </Container>
    </footer>
  );
}
