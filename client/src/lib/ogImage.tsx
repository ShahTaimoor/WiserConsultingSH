import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/** Branded 1200x630 social-share card, generated at build time (no static asset to maintain). */
export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0a0a0b",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: "#22d3ee", textTransform: "uppercase" }}>
          Software House · Peshawar, Pakistan
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 700, lineHeight: 1.05 }}>Tech Wiser Consulting</div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 36, color: "#a3a3a3" }}>
            Custom software, e-commerce &amp; business systems
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#737373" }}>tech.wiserconsulting.info</div>
      </div>
    ),
    OG_SIZE
  );
}
