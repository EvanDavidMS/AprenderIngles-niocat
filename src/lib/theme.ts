"use client";

import { useSyncExternalStore } from "react";
import { THEME_KEY } from "./theme-script";

export type Theme = "light" | "dark";

const listeners = new Set<() => void>();

function current(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function useTheme() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    current,
    () => "light" as Theme,
  );
}

export function setTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.add("theme-transition");
  root.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // sin almacenamiento: el tema dura esta visita
  }
  listeners.forEach((l) => l());
  window.setTimeout(() => root.classList.remove("theme-transition"), 450);
}
