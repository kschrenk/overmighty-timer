import { useEffect, useState } from "react";

export function useIsLandscape(): boolean {
  const getIsLandscape = () =>
    typeof window !== "undefined"
      ? window.matchMedia("(orientation: landscape)").matches
      : false;

  const [isLandscape, setIsLandscape] = useState(getIsLandscape);

  useEffect(() => {
    const mql = window.matchMedia("(orientation: landscape)");
    const handler = (e: MediaQueryListEvent) => setIsLandscape(e.matches);

    mql.addEventListener("change", handler);

    return () => {
      mql.removeEventListener("change", handler);
    };
  }, []);

  return isLandscape;
}
