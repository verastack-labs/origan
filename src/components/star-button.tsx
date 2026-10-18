"use client";

import type { MouseEvent } from "react";

/**
 * The star in the corner of a shelf card. A real button with `aria-pressed`,
 * and a sibling of the card's link, never inside it, so pressing it cannot
 * follow the link and nothing relies on `stopPropagation`.
 *
 * Starring: the star fills with the survey accent, gives one small pop, and a
 * few short rays burst out and fade. Unstarring: the star empties with a
 * quieter dip and no rays. Under `prefers-reduced-motion` only the fill
 * changes. Pressing again mid-animation cancels the running one before the next
 * starts, so animations never stack. Built on `element.animate`, with no
 * animation library.
 */
const RAYS = [0, 60, 120, 180, 240, 300];

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animateStar(button: HTMLElement, starring: boolean) {
  // Whatever is still running is cancelled, so a fast double press snaps to the start of the new one.
  button.getAnimations({ subtree: true }).forEach((a) => a.cancel());

  const icon = button.querySelector<HTMLElement>("[data-icon]");
  icon?.animate(
    starring
      ? [{ transform: "scale(1)" }, { transform: "scale(1.25)", offset: 0.45 }, { transform: "scale(1)" }]
      : [{ transform: "scale(1)" }, { transform: "scale(0.85)", offset: 0.5 }, { transform: "scale(1)" }],
    { duration: starring ? 280 : 180, easing: "cubic-bezier(0.2, 0.8, 0.3, 1)" },
  );

  if (!starring) return;
  button.querySelectorAll<HTMLElement>("[data-ray]").forEach((ray) => {
    const angle = Number(ray.dataset.ray);
    ray.animate(
      [
        { opacity: 1, transform: `rotate(${angle}deg) translateY(-9px) scaleY(0.6)` },
        { opacity: 0, transform: `rotate(${angle}deg) translateY(-19px) scaleY(1)` },
      ],
      { duration: 460, easing: "cubic-bezier(0.1, 0.7, 0.3, 1)" },
    );
  });
}

export function StarButton({
  name,
  starred,
  onToggle,
}: {
  name: string;
  starred: boolean;
  onToggle: () => void;
}) {
  function press(event: MouseEvent<HTMLButtonElement>) {
    if (!reducedMotion()) animateStar(event.currentTarget, !starred);
    onToggle();
  }

  return (
    <button
      type="button"
      aria-pressed={starred}
      aria-label={`${starred ? "Unstar" : "Star"} ${name}`}
      onClick={press}
      className="absolute right-2.5 top-2.5 z-10 inline-flex size-9 items-center justify-center rounded-control border border-transparent text-fg-3 transition-colors duration-150 hover:border-survey-2 hover:text-fg aria-pressed:text-survey"
    >
      <span className="relative inline-flex">
        <svg
          data-icon=""
          width="18"
          height="18"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="overflow-visible"
        >
          <path
            d="M12 2.6l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.4 6.1 20.7l1.3-6.6L2.5 9.5l6.6-.8z"
            strokeWidth="1.7"
            strokeLinejoin="round"
            className={starred ? "fill-survey stroke-survey" : "fill-transparent stroke-current"}
          />
        </svg>
        {RAYS.map((angle) => (
          <span
            key={angle}
            data-ray={angle}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -ml-px -mt-[3px] h-1.5 w-0.5 rounded-full bg-survey opacity-0"
          />
        ))}
      </span>
    </button>
  );
}
