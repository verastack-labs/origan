import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import { palette, token } from "@/lib/tokens";

/**
 * The social card, generated at build rather than exported from a design tool,
 * so it cannot drift from the site's own palette.
 *
 * Deliberately simple geometry: Satori renders a subset of CSS, and a card that
 * depends on clever layout is a card that silently breaks the build. The
 * diagonal is the traverse, which is the one mark this brand needs to be
 * recognised by.
 */
export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function GET() {
  // Read at build time so the card cannot drift from the site's palette.
  const p = palette();
  const GROUND = token(p, "ground");
  const SURVEY = token(p, "survey");
  const SURVEY_2 = token(p, "survey-2");
  const FG = token(p, "fg");
  const FG_3 = token(p, "fg-3");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: GROUND,
          padding: 64,
          position: "relative",
        }}
      >
        {/* The traverse, climbing left to right. */}
        <div
          style={{
            position: "absolute",
            left: -60,
            bottom: 96,
            width: 1000,
            height: 3,
            background: SURVEY,
            transform: "rotate(-21deg)",
            transformOrigin: "left center",
            display: "flex",
          }}
        />
        {/* Its terminal station. */}
        <div
          style={{
            position: "absolute",
            left: 856,
            top: 176,
            width: 0,
            height: 0,
            borderLeft: "16px solid transparent",
            borderRight: "16px solid transparent",
            borderBottom: `28px solid ${FG}`,
            display: "flex",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 19,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: SURVEY_2,
            }}
          >
            {site.studio}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 128,
              fontWeight: 800,
              letterSpacing: -5,
              color: FG,
              lineHeight: 1,
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontSize: 36,
              color: FG_3,
              maxWidth: 820,
              lineHeight: 1.3,
            }}
          >
            {site.tagline}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
