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

export const surfaceGlyphs = {
  roadmap: GlyphTraverse,
  playlists: GlyphStaff,
  sheets: GlyphSheet,
  tests: GlyphSpotHeights,
  avsar: GlyphStation,
  progress: GlyphContours,
} as const;
