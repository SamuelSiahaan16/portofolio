import { useEffect, useState } from "react";
import type { SectionId } from "@/config/site";
import { siteConfig } from "@/config/site";

export function useActiveSection() {
  const [activeId, setActiveId] = useState<SectionId>("hero");

  useEffect(() => {
    const sections = siteConfig.sections
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const top = visible[0]?.target.id as SectionId | undefined;
        if (top) setActiveId(top);
      },
      {
        rootMargin: "-30% 0px -45% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return activeId;
}
