import { Container } from "@/components/ui/Container";
import { fullWidthSectionIds, siteConfig } from "@/config/site";
import { renderSection } from "@/features/portfolio/sections";

export function HomePage() {
  return (
    <>
      {siteConfig.sections.map((sectionId) => {
        const section = renderSection(sectionId);

        if (fullWidthSectionIds.includes(sectionId)) {
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
