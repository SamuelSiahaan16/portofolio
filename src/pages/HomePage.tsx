import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { renderSection } from "@/features/portfolio/sections";

export function HomePage() {
  return (
    <>
      {siteConfig.sections.map((sectionId) => {
        const section = renderSection(sectionId);

        if (sectionId === "hero") {
          return section;
        }

        return (
          <Container key={sectionId} as="div">
            {section}
          </Container>
        );
      })}
    </>
  );
}
