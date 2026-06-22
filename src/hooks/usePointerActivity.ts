import { useEffect, useRef, useState } from "react";

const DEFAULT_IDLE_MS = 2200;

/**
 * `true` saat pointer/keyboard aktif; `false` setelah idle tanpa gerakan.
 */
export function usePointerActivity(idleMs = DEFAULT_IDLE_MS) {
  const [active, setActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const markActive = () => {
      setActive(true);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setActive(false), idleMs);
    };

    window.addEventListener("mousemove", markActive, { passive: true });
    window.addEventListener("touchstart", markActive, { passive: true });
    window.addEventListener("keydown", markActive);

    return () => {
      window.removeEventListener("mousemove", markActive);
      window.removeEventListener("touchstart", markActive);
      window.removeEventListener("keydown", markActive);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [idleMs]);

  return active;
}
