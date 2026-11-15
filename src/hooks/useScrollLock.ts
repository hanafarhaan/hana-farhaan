import { useEffect } from "react";

/** Locks page scrolling (used while the opening film plays). */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("is-locked", locked);
    return () => root.classList.remove("is-locked");
  }, [locked]);
}
