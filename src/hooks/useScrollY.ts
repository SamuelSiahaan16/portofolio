import { useEffect, useState } from "react";

export function useScrollY() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const update = () => setScrollY(window.scrollY);

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return scrollY;
}
