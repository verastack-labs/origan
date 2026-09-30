"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type Variant = "rise" | "plot" | "label";

/**
 * One entrance mechanism, three renderings, so arrivals read as a single
 * system rather than as scattered effects.
 *
 * `rise` is the plain fade and lift, for body copy and groups of controls.
 *
 * `plot` is for headlines: a pen travels left to right and the words resolve
 * behind it, which is a plotter drawing a line of text. It replaces the fade
 * rather than adding to it, because two motions on one element is noise.
 *
 * `label` is for the small tracked notation: characters print in sequence, so
 * the monospace reads as a readout rather than as a font choice.
 *
 * The hiding classes ship in the markup, and the stylesheet only acts on them
 * under `html.js`, which an inline script sets before first paint. Adding the
 * class from an effect instead makes every heading paint, vanish and then
 * animate, which reads as a bug. Without JavaScript nothing hides at all.
 */
const variantClass: Record<Variant, string> = {
  rise: "rv",
  plot: "rv-plot",
  label: "rv-label",
};

export function Reveal({
  as: Tag = "div",
  variant = "rise",
  className = "",
  children,
  ...rest
}: {
  as?: ElementType;
  variant?: Variant;
  className?: string;
  children: ReactNode;
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Only the plain variant staggers against its siblings. A headline should
    // start drawing the moment it arrives, not wait its turn.
    if (variant === "rise") {
      const siblings = Array.from(el.parentElement?.children ?? []).filter((c) =>
        c.classList.contains("rv"),
      );
      el.style.transitionDelay = `${Math.max(0, siblings.indexOf(el)) * 70}ms`;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.in = "true";
        io.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [variant]);

  const cls = `${variantClass[variant]} ${className}`.trim();

  if (variant === "plot") {
    return (
      <Tag ref={ref} className={cls} {...rest}>
        <span className="plot-ink">{children}</span>
        <span className="plot-pen" aria-hidden="true" />
      </Tag>
    );
  }

  if (variant === "label" && typeof children === "string") {
    // Split into words first, then characters inside each word, and stop a
    // word from breaking. Every character is its own inline-block so it can be
    // animated, and a browser will happily break a line between two of them:
    // without this the notation wrapped as "PREPARATION F / OR ENGINEERING"
    // on a phone.
    const words = children.split(" ");
    let printed = -1;

    return (
      <Tag ref={ref} className={cls} {...rest}>
        <span className="sr-only">{children}</span>
        <span aria-hidden="true">
          {words.map((word, w) => (
            <span key={w} className="inline-block whitespace-pre">
              {Array.from(w < words.length - 1 ? `${word} ` : word).map((ch, i) => {
                printed += 1;
                return (
                  <span
                    key={i}
                    className="plot-char"
                    style={{ animationDelay: `${printed * 16}ms` }}
                  >
                    {ch}
                  </span>
                );
              })}
            </span>
          ))}
        </span>
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={cls} {...rest}>
      {children}
    </Tag>
  );
}
