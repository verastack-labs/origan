import { ImageResponse } from "next/og";
import { palette, token } from "@/lib/tokens";

/**
 * The Origan mark as a square PNG, for the structured data's `logo`. Drawn at
 * build from the same palette and shapes as the favicon (icon.svg), so the two
 * agree. Search engines want a raster logo of at least 112 pixels, and an SVG
 * favicon does not count.
 */
export const dynamic = "force-static";

const SIZE = 512;

export function GET() {
  const p = palette();
  const GROUND = token(p, "ground");
  const SURVEY = token(p, "survey");

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: GROUND }}>
        <svg width={SIZE} height={SIZE} viewBox="0 0 32 32">
          <path d="M16 7l9.5 17h-19z" fill="none" stroke={SURVEY} strokeWidth="2.2" strokeLinejoin="round" />
          <circle cx="16" cy="20.5" r="2.4" fill={SURVEY} />
        </svg>
      </div>
    ),
    { width: SIZE, height: SIZE },
  );
}
