import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Eprox Studio — Digital Engineering Studio";

// Playfair Display 700 straight from Google's static font host; if the
// fetch ever fails the card still renders with satori's default face.
async function loadDisplayFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700"
    ).then((res) => res.text());
    const url = css.match(/src: url\((.+?)\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((res) => res.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const displayFont = await loadDisplayFont();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0A0A0A",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(201,121,60,0.28) 0%, rgba(201,121,60,0.08) 45%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 560,
          height: 560,
          borderRadius: 9999,
          border: "1px solid rgba(201,121,60,0.25)",
        }}
      />
      <svg width="110" height="110" viewBox="0 0 512 512">
        <polygon
          points="465,256 361,437 151,437 47,256 151,75 361,75"
          fill="none"
          stroke="#C9793C"
          strokeOpacity="0.85"
          strokeWidth="26"
          strokeLinejoin="round"
        />
        <g fill="#C9793C">
          <rect x="196" y="166" width="26" height="180" />
          <rect x="196" y="166" width="120" height="26" />
          <rect x="196" y="243" width="96" height="26" />
          <rect x="196" y="320" width="120" height="26" />
        </g>
      </svg>
      <div
        style={{
          marginTop: 36,
          fontSize: 88,
          color: "#F2EFE9",
          fontFamily: displayFont ? "Playfair" : "serif",
          letterSpacing: "0.02em",
          display: "flex",
        }}
      >
        Eprox&nbsp;
        <span style={{ color: "#C9793C", fontStyle: "italic" }}>Studio</span>
      </div>
      <div
        style={{
          marginTop: 22,
          fontSize: 22,
          color: "rgba(242,239,233,0.55)",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          fontFamily: "monospace",
        }}
      >
        Digital Engineering
      </div>
    </div>,
    {
      ...size,
      fonts: displayFont
        ? [
            {
              name: "Playfair",
              data: displayFont,
              weight: 700,
              style: "normal",
            },
          ]
        : undefined,
    }
  );
}
