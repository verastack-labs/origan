/**
 * The glyph set, drawn from survey and levelling notation rather than from a
 * general-purpose icon library.
 *
 * Every mark here is a real thing a surveyor draws: a traverse between
 * stations, a levelling staff, a plotted sheet, spot heights, a triangulation
 * station, a contour stack. Using these instead of a list-and-play-button set
 * is what keeps the interface study inside the same world as the page around
 * it. One stroke weight throughout, no fills except where a mark is solid by
 * convention.
 */

type GlyphProps = { size?: number; className?: string };

function Frame({ size = 16, className = "", children }: GlyphProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** Traverse: stations joined by legs. The route through a roadmap. */
export function GlyphTraverse(props: GlyphProps) {
  return (
    <Frame {...props}>
      <path d="M2 12.5l4-4 3.5 2L14 4" />
      <circle cx="2" cy="12.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="6" cy="8.5" r="1.1" />
      <circle cx="9.5" cy="10.5" r="1.1" />
      <circle cx="14" cy="4" r="1.3" />
    </Frame>
  );
}

/** Levelling staff: the graduated rod read through the instrument. */
export function GlyphStaff(props: GlyphProps) {
  return (
    <Frame {...props}>
      <path d="M5.5 2h5v12h-5z" />
      <path d="M5.5 5h5M5.5 8h5M5.5 11h5" />
    </Frame>
  );
}

/** Plotted sheet: a bordered drawing with its title block. */
export function GlyphSheet(props: GlyphProps) {
  return (
    <Frame {...props}>
      <path d="M2.5 2.5h11v11h-11z" />
      <path d="M9 13.5v-3h4.5" />
      <path d="M5 6h4" />
    </Frame>
  );
}

/** Spot heights: measured points scattered across a surface. */
export function GlyphSpotHeights(props: GlyphProps) {
  return (
    <Frame {...props}>
      <path d="M3.4 4.4v2M2.4 5.4h2M11.4 3.4v2M10.4 4.4h2M6.4 10.4v2M5.4 11.4h2" />
      <circle cx="12.2" cy="11.2" r="1.2" fill="currentColor" stroke="none" />
    </Frame>
  );
}

/** Triangulation station: the trig point, a known position to work from. */
export function GlyphStation(props: GlyphProps) {
  return (
    <Frame {...props}>
      <path d="M8 2.5l5.5 10h-11z" />
      <circle cx="8" cy="10.2" r="1.3" fill="currentColor" stroke="none" />
    </Frame>
  );
}

/** Contour stack: nested levels, the ground rising. */
export function GlyphContours(props: GlyphProps) {
  return (
    <Frame {...props}>
      <path d="M1.5 12.5c3-4 10.5-4 13 0" />
      <path d="M3.5 9.5c2.2-3 6.8-3 9 0" />
      <path d="M5.5 6.5c1.3-2 3.7-2 5 0" />
    </Frame>
  );
}

/**
 * Instrument on a tripod: the level or theodolite, set up over a point. The
 * thing that actually takes a reading, which is why it stands for the person
 * rather than for the platform.
 */
export function GlyphInstrument(props: GlyphProps) {
  return (
    <Frame {...props}>
      <path d="M4 4.5h8" />
      <path d="M8 4.5v2.5" />
      <path d="M8 7l-4.5 6.5M8 7l4.5 6.5M8 7v6.5" />
    </Frame>
  );
}

/**
 * Bench mark: the cut arrow with a bar across it, chiselled into something
 * that will not move. A height everything else is measured from.
 */
export function GlyphBenchmark(props: GlyphProps) {
  return (
    <Frame {...props}>
      <path d="M3.5 4.5h9" />
      <path d="M8 4.5v4" />
      <path d="M3.5 13l4.5-4.5 4.5 4.5" />
    </Frame>
  );
}

/** Field book: the ruled notebook a reading is written into on site. */
export function GlyphFieldBook(props: GlyphProps) {
  return (
    <Frame {...props}>
      <path d="M3.5 2.5h9v11h-9z" />
      <path d="M6 2.5v11" />
      <path d="M8 6h2.5M8 9h2.5" />
    </Frame>
  );
}

/** Legend: the key in the sheet's corner that says what each mark means. */
export function GlyphLegend(props: GlyphProps) {
  return (
    <Frame {...props}>
      <path d="M2.5 3.5h11v9h-11z" />
      <circle cx="5.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
      <path d="M8 6.5h3" />
      <path d="M4.4 9.8h2.2" />
      <path d="M8 9.8h3" />
    </Frame>
  );
}

/** Sheet grid: a set divided into numbered panels. Cohorts, sections, batches. */
export function GlyphGrid(props: GlyphProps) {
  return (
    <Frame {...props}>
      <path d="M2.5 2.5h11v11h-11z" />
      <path d="M8 2.5v11M2.5 8h11" />
      <path d="M2.5 8h5.5v5.5h-5.5z" fill="currentColor" stroke="none" opacity={0.35} />
    </Frame>
  );
}

/** Bearing: a sight taken across distance, with the angle it was read at. */
export function GlyphBearing(props: GlyphProps) {
  return (
    <Frame {...props}>
      <circle cx="3.5" cy="12.5" r="1.3" fill="currentColor" stroke="none" />
      <path d="M3.5 12.5L13 3.5" />
      <path d="M3.5 12.5h7" strokeDasharray="1.6 1.6" />
      <path d="M8.2 12.5a5 5 0 00-1.3-3.2" strokeWidth={1} />
    </Frame>
  );
}

/** Peg: a stake driven into the ground to hold a position on site. */
export function GlyphPeg(props: GlyphProps) {
  return (
    <Frame {...props}>
      <path d="M2 10.5h12" />
      <path d="M8 2v8.5" />
      <path d="M6.2 13.8L8 10.5l1.8 3.3z" />
    </Frame>
  );
}

/**
 * Reciprocal observation: two instruments sighting each other so the error in
 * one reading is cancelled by the other. A conversation, in survey terms.
 */
export function GlyphReciprocal(props: GlyphProps) {
  return (
    <Frame {...props}>
      <circle cx="3" cy="4.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="13" cy="11.5" r="1.3" fill="currentColor" stroke="none" />
      <path d="M4.6 6.2l6.6 4.2" />
      <path d="M11.4 5.4L4.8 9.8" strokeDasharray="1.8 1.6" />
    </Frame>
  );
}

/** Chain: the measured line, one link per interval. Distance along a route. */
export function GlyphChain(props: GlyphProps) {
  return (
    <Frame {...props}>
      <path d="M1.5 8h13" />
      <path d="M4 5.8v4.4M8 5.2v5.6M12 5.8v4.4" />
    </Frame>
  );
}

/** North arrow, for the hero's drawing furniture. */
export function NorthArrow({ size = 34, className = "" }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 34 34"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="17" cy="17" r="12.5" stroke="currentColor" strokeWidth={0.8} opacity={0.45} />
      <path d="M17 5.5l4 16-4-3.4-4 3.4z" stroke="currentColor" strokeWidth={1} fill="none" />
      <path d="M17 5.5l4 16-4-3.4z" fill="currentColor" opacity={0.85} />
      <text
        x="17"
        y="32"
        textAnchor="middle"
        fontSize="7.5"
        fontFamily="var(--font-mono)"
        letterSpacing="0.1em"
        fill="currentColor"
      >
        N
      </text>
    </svg>
  );
}

/** Scale bar, the other half of a drawing's furniture. */
export function ScaleBar({ className = "" }: { className?: string }) {
  return (
    <svg
      width="118"
      height="20"
      viewBox="0 0 118 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={i * 26}
          y={2}
          width={26}
          height={5}
          fill={i % 2 ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={0.8}
        />
      ))}
      <text x="0" y="17" fontSize="7.5" fontFamily="var(--font-mono)" fill="currentColor">
        0
      </text>
      <text x="96" y="17" fontSize="7.5" fontFamily="var(--font-mono)" fill="currentColor">
        4 YRS
      </text>
    </svg>
  );
}

/**
 * The set, addressable by name, so `content.ts` can say which mark belongs to
 * an item without importing a component into the copy.
 */
export const glyphs = {
  traverse: GlyphTraverse,
  staff: GlyphStaff,
  sheet: GlyphSheet,
  spotHeights: GlyphSpotHeights,
  station: GlyphStation,
  contours: GlyphContours,
  instrument: GlyphInstrument,
  benchmark: GlyphBenchmark,
  fieldBook: GlyphFieldBook,
  legend: GlyphLegend,
  grid: GlyphGrid,
  bearing: GlyphBearing,
  peg: GlyphPeg,
  reciprocal: GlyphReciprocal,
  chain: GlyphChain,
} as const;

export type GlyphName = keyof typeof glyphs;

/** Render a glyph by name, in a ruled square, the way a legend prints one. */
export function Glyph({
  name,
  size = 17,
  className = "text-survey",
}: {
  name: GlyphName;
  size?: number;
  className?: string;
}) {
  const Mark = glyphs[name];
  return (
    <span
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-control border border-line-2 ${className}`}
    >
      <Mark size={size} />
    </span>
  );
}

export const surfaceGlyphs = {
  roadmap: GlyphTraverse,
  playlists: GlyphStaff,
  sheets: GlyphSheet,
  tests: GlyphSpotHeights,
  avsar: GlyphStation,
  progress: GlyphContours,
} as const;
