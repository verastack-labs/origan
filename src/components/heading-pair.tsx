import { Fragment, type ReactNode } from "react";
import { Reveal } from "./reveal";

/**
 * A heading never stands alone on this site. It comes as a pair, in one of two
 * shapes, and the data says which by the fields it carries:
 *
 * - **Heading first** (`sub`): a one-line heading that hits, then a subheading
 *   that lands the impact.
 * - **Kicker first** (`kicker`): a line that sets it up, then a one-line
 *   heading that lands the point.
 *
 * Long, wrapping headlines read as unreviewed copy. Splitting the claim from
 * its framing keeps every heading short enough to hold one line on a laptop.
 * See origan-internal/docs/copy-deck.md for every pair on the site.
 *
 * One word of a heading can be set in the accent by bracketing it in the data:
 * "Four years, not four [weeks]."
 */
export type Pair = { heading: string; sub?: string; kicker?: string };

const ACCENT = /\[([^\]]+)\]/;

/**
 * The heading with its bracketed word set in the accent. A newline in the data
 * is a deliberate break, for the one heading allowed to take two lines.
 */
export function accented(text: string): ReactNode {
  const lines = text.split("\n");
  return lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {accentLine(line)}
    </Fragment>
  ));
}

function accentLine(text: string): ReactNode {
  const match = ACCENT.exec(text);
  if (!match) return text;
  const at = match.index;
  return (
    <>
      {text.slice(0, at)}
      <em className="not-italic text-survey">{match[1]}</em>
      {text.slice(at + match[0].length)}
    </>
  );
}

/** The heading as plain text, for metadata and anywhere markup cannot go. */
export function plain(text: string): string {
  return text.replace(/\[([^\]]+)\]/g, "$1").replace(/\n/g, " ");
}

const sizes = {
  hero: {
    heading: "text-[clamp(40px,7vw,92px)] font-extrabold leading-[0.95] tracking-[-0.045em]",
    line: "max-w-[46ch] text-[clamp(17px,1.9vw,21px)]",
    gap: "mt-5",
  },
  page: {
    heading: "text-[clamp(32px,5.4vw,64px)] font-bold leading-[1.03] tracking-[-0.04em]",
    // A page head has the whole shell to itself, so its line may run longer.
    line: "max-w-[60ch] text-[clamp(17px,1.8vw,20.5px)]",
    gap: "mt-[18px]",
  },
  section: {
    heading: "text-[clamp(27px,4.2vw,48px)] font-bold leading-[1.06] tracking-[-0.035em]",
    line: "max-w-[54ch] text-[clamp(16.5px,1.6vw,19px)]",
    gap: "mt-4",
  },
  card: {
    heading: "text-[clamp(20px,2.4vw,26px)] font-bold leading-[1.15] tracking-[-0.025em]",
    line: "max-w-[48ch] text-[15.5px]",
    gap: "mt-2.5",
  },
} as const;

export function HeadingPair({
  pair,
  as = "h2",
  size = "section",
  className = "",
  headingClassName = "",
  headingProps,
}: {
  pair: Pair;
  as?: "h1" | "h2" | "h3";
  size?: keyof typeof sizes;
  /** On the wrapper: the space above the pair, usually below a notation label. */
  className?: string;
  /** Extra classes for the heading itself, such as a width that forces a break. */
  headingClassName?: string;
  /** Attributes for the heading element, such as an `id` and `tabIndex` so it can take focus. */
  headingProps?: Record<string, unknown>;
}) {
  const s = sizes[size];
  // text-pretty: a wrapped line never leaves a single word alone on the last row.
  const line = `${s.line} text-pretty leading-[1.45] tracking-[-0.01em] text-fg-2`;

  return (
    <div className={className}>
      {pair.kicker && (
        <Reveal as="p" className={line}>
          {pair.kicker}
        </Reveal>
      )}
      <Reveal
        as={as}
        variant="plot"
        className={`${pair.kicker ? s.gap : ""} text-balance ${s.heading} ${headingClassName}`}
        {...headingProps}
      >
        {accented(pair.heading)}
      </Reveal>
      {pair.sub && (
        <Reveal as="p" className={`${s.gap} ${line}`}>
          {pair.sub}
        </Reveal>
      )}
    </div>
  );
}
