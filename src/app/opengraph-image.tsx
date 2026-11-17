import { ImageResponse } from "next/og";

export const alt = "Zapiboo - Kids and family services in Bangalore";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#edf5ff",
        color: "#102e56",
        padding: "65px",
        position: "relative",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", fontSize: 42, fontWeight: 700 }}>
        Zapiboo<span style={{ color: "#0075ce" }}>.</span>
      </div>
      <div style={{ display: "flex", fontSize: 19, marginTop: 22, color: "#52657d" }}>
        KIDS & FAMILY SERVICES / BANGALORE
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 30,
          fontSize: 76,
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: "-4px",
        }}
      >
        <span>Care. Learning.</span>
        <span style={{ color: "#0075ce" }}>Play in Bangalore.</span>
      </div>
      <div style={{ display: "flex", gap: 13, marginTop: 35, fontSize: 20 }}>
        <span style={{ background: "#ffd365", borderRadius: 18, padding: "15px 24px" }}>
          Care & learning
        </span>
        <span style={{ background: "#ffe7ed", borderRadius: 18, padding: "15px 24px" }}>
          Play & activities
        </span>
        <span style={{ background: "#fff", borderRadius: 18, padding: "15px 24px" }}>
          Family support
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          display: "flex",
          right: 65,
          top: 65,
          width: 135,
          height: 135,
          background: "#ffd365",
          borderRadius: 100,
          alignItems: "center",
          justifyContent: "center",
          fontSize: 23,
          fontWeight: 700,
          transform: "rotate(12deg)",
        }}
      >
        GROW.
      </div>
      <div
        style={{
          position: "absolute",
          display: "flex",
          bottom: 30,
          right: 65,
          color: "#52657d",
          fontSize: 17,
        }}
      >
        zapiboo.com
      </div>
    </div>,
    size,
  );
}
