import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type DockPlacement = "center" | "top";

const DockPlacementContext = createContext<DockPlacement>("center");

export function DockPlacementProvider({ children }: { children: ReactNode }) {
  const placement = useDockPlacementState();

  return (
    <DockPlacementContext.Provider value={placement}>
      {children}
    </DockPlacementContext.Provider>
  );
}

export function useDockPlacement() {
  return useContext(DockPlacementContext);
}

function useDockPlacementState(): DockPlacement {
  const [placement, setPlacement] = useState<DockPlacement>("center");
  const placementRef = useRef<DockPlacement>("center");

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const update = () => {
      const { top, bottom } = hero.getBoundingClientRect();
      const scrollY = window.scrollY;
      const current = placementRef.current;

      if (current === "center") {
        const leaveCenter =
          scrollY > 72 ||
          top < -40 ||
          bottom < window.innerHeight * 0.72;

        if (leaveCenter) {
          placementRef.current = "top";
          setPlacement("top");
        }
        return;
      }

      const returnHome =
        scrollY < 24 &&
        top >= -8 &&
        top <= 32 &&
        bottom > window.innerHeight * 0.82;

      if (returnHome) {
        placementRef.current = "center";
        setPlacement("center");
      }
    };

    update();

    const observer = new IntersectionObserver(update, {
      threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
    });
    observer.observe(hero);

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return placement;
}
