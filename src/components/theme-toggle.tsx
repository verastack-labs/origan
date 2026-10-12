"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { THEME_KEY } from "@/lib/theme";

/**
 * Light or dark. Light is the default for everyone, whatever the operating
 * system prefers: it is the first impression the site is designed around.
 * Dark is a reader's choice, stored, and applied by the inline script in the
 * layout before first paint, so a returning reader never sees a light flash.
 *
 * The theme lives on `<html data-theme>`, outside React, so this reads it as an
 * external store rather than mirroring it into state.
 */
const EVENT = "origan-theme";

type Theme = "light" | "dark";

function read(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

function apply(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") root.dataset.theme = "dark";
  else delete root.dataset.theme;

  // Private windows and locked-down browsers can refuse storage. The switch
  // still works for the visit; it just is not remembered.
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}

  window.dispatchEvent(new Event(EVENT));
}

export function ThemeToggle() {
  // The server cannot know, and light is what it renders.
  const theme = useSyncExternalStore(subscribe, read, () => "light" as Theme);
  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => apply(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="inline-flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-control border border-line text-fg transition-colors hover:border-survey-2 hover:text-survey"
    >
      {theme === "dark" ? (
        <Sun size={16} strokeWidth={1.9} aria-hidden="true" />
      ) : (
        <Moon size={16} strokeWidth={1.9} aria-hidden="true" />
      )}
    </button>
  );
}

