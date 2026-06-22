import { useEffect, useState } from "react";

export function useFooterInView() {
  const [inFooter, setInFooter] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setInFooter(entry.isIntersecting && entry.intersectionRatio >= 0.35);
      },
      {
        rootMargin: "-15% 0px -15% 0px",
        threshold: [0, 0.2, 0.35, 0.5, 0.75, 1],
      },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return inFooter;
}
