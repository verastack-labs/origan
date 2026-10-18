import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import { palette, token } from "@/lib/tokens";

/**
 * The social card for the learning pages, made the way the site's own card is
 * (`src/app/og.png/route.tsx`): generated at build, with every colour read out
 * of the stylesheet so it cannot drift from the palette. Same ground, same
 * traverse climbing to its terminal station, with the section and the lesson
 * in place of the site name.
 */
export const ogSize = { width: 1200, height: 630 };

export function lessonCard({ kicker, title, sub }: { kicker: string; title: string; sub: string }) {
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

        <div
          style={{
            display: "flex",
            fontSize: 19,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: SURVEY_2,
          }}
        >
          {`${site.name} · ${kicker}`}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 48 ? 64 : title.length > 24 ? 92 : 112,
              fontWeight: 800,
              letterSpacing: -4,
              color: FG,
              lineHeight: 1,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontSize: 34,
              color: FG_3,
              maxWidth: 860,
              lineHeight: 1.3,
            }}
          >
            {sub}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 19,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: SURVEY_2,
            }}
          >
            {`Made by ${site.studio}`}
          </div>
        </div>
      </div>
    ),
    ogSize,
  );
}
