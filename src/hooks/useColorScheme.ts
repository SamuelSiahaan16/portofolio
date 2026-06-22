import { useEffect, useState } from "react";

export type ColorScheme = "light" | "dark";

export function useColorScheme(): ColorScheme {
  const [scheme, setScheme] = useState<ColorScheme>(() => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      setScheme(event.matches ? "dark" : "light");
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return scheme;
}
