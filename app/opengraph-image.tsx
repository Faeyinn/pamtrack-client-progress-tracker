import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "PAM Techno - Client Progress Tracker";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        backgroundImage:
          "radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)",
        backgroundSize: "100px 100px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 80px",
          backgroundColor: "white",
          border: "1px solid #e5e5e5",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            background: "linear-gradient(to bottom right, #111, #444)",
            backgroundClip: "text",
            color: "transparent",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          PAM Techno
        </div>
      </div>
      <div
        style={{
          marginTop: 40,
          fontSize: 32,
          color: "#666",
          fontWeight: 500,
        }}
      >
        Client Progress Tracker
      </div>
    </div>,
    {
      ...size,
    },
  );
}
