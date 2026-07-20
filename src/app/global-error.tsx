"use client";

// Last-resort boundary: renders when the root layout itself crashes, so it
// cannot rely on fonts, Tailwind, i18n or any provider — plain inline styles
// on the brand palette only.
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          color: "#F2EFE9",
          fontFamily: "Georgia, 'Times New Roman', serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div>
          <p
            style={{
              letterSpacing: "0.3em",
              fontSize: 11,
              color: "#C9793C",
              textTransform: "uppercase",
              fontFamily: "monospace",
            }}
          >
            Eprox Studio
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 400, margin: "16px 0 8px" }}>
            Something went wrong.
          </h1>
          <p
            style={{ color: "rgba(242,239,233,0.6)", fontSize: 15, margin: 0 }}
          >
            Please reload the page or try again in a moment.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: 28,
              padding: "12px 28px",
              borderRadius: 999,
              border: "1px solid rgba(201,121,60,0.5)",
              background: "transparent",
              color: "#F2EFE9",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontSize: 11,
              fontFamily: "monospace",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
