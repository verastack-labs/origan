import type { ReactNode } from "react";

const base =
  "inline-flex items-center gap-2.5 rounded-control px-[22px] py-[13px] font-mono text-[11px] font-semibold uppercase tracking-[0.08em] transition-[background-color,border-color,color,transform] duration-200 ease-survey";

const tones = {
  primary: "bg-survey text-survey-ink hover:bg-survey/85 hover:-translate-y-px",
  secondary: "border border-line text-fg-2 hover:border-survey-2 hover:text-fg",
} as const;

export function Action({
  href,
  tone = "primary",
  children,
}: {
  href: string;
  tone?: keyof typeof tones;
  children: ReactNode;
}) {
  return (
    <a href={href} className={`${base} ${tones[tone]}`}>
      {children}
    </a>
  );
}
