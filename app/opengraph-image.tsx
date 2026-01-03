import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "GPA Calculator - Calculate your semester GPA instantly";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  // Font loading (using standard fonts available in edge usually, or simple fetch if needed)
  // For simplicity and speed in this environment, we'll use system-like fonts or fetch Inter if possible.
  // Note: opengraph-image often requires fetch for fonts. We will use a standard sans-serif here.

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #1a1b2e, #11121c)", // Dark Indigo Theme
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          color: "white",
          position: "relative",
        }}
      >
        {/* Abstract "Glass" shapes for background ambience */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "10%",
            width: "400px",
            height: "400px",
            background: "#00f5c0", // Neon Teal
            borderRadius: "50%",
            filter: "blur(180px)",
            opacity: 0.2,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "10%",
            width: "300px",
            height: "300px",
            background: "#4f46e5", // Indigo/Purple
            borderRadius: "50%",
            filter: "blur(150px)",
            opacity: 0.2,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "60px 100px",
            borderRadius: "40px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              background: "linear-gradient(to bottom, #ffffff, #a5b4fc)",
              backgroundClip: "text",
              color: "transparent",
              marginBottom: 20,
              letterSpacing: "-0.02em",
            }}
          >
            GPA Calculator
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#a1a1aa", // muted foreground
              textAlign: "center",
              maxWidth: 800,
              lineHeight: 1.5,
            }}
          >
            Calculate. Track. Succeed.
          </div>

          <div style={{ display: "flex", marginTop: 40, alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#00f5c0",
                color: "#11121c",
                padding: "12px 30px",
                borderRadius: "20px",
                fontSize: 24,
                fontWeight: "bold",
              }}
            >
              Calculate Now
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
