import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 18,
          background: "linear-gradient(135deg, #14a394 0%, #0b8577 100%)",
          color: "white",
          fontSize: 36,
          fontWeight: 900,
          fontFamily: "sans-serif",
        }}
      >
        F
      </div>
    ),
    {
      ...size,
    },
  );
}
