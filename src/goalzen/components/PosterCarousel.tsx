import { useEffect, useRef, useState } from "react";
import { onImgFallback } from "../lib/utils";

interface Props {
  images: string[];
  hidden?: boolean;
}

const containerStyle: React.CSSProperties = {
  margin: "10px 15px",
  borderRadius: 12,
  overflow: "hidden",
  position: "relative",
  aspectRatio: "16/9",
  maxHeight: 250,
  border: "1.5px solid #39ff14",
  boxShadow: "0 0 10px rgba(57, 255, 20, 0.2)",
};

/** Clean CSS-only banner used when FUSION.json ships no Banners array. */
function GradientBanner() {
  return (
    <div
      id="poster-carousel-container"
      style={{
        ...containerStyle,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0b0f19 0%, #0f2a3d 45%, #062e21 100%)",
      }}
    >
      <div style={{ textAlign: "center", padding: 12 }}>
        <div
          style={{
            fontSize: 26,
            fontWeight: 900,
            letterSpacing: "2px",
            color: "#39ff14",
            textShadow: "0 0 12px rgba(57,255,20,0.45)",
            fontFamily: "'Rajdhani', sans-serif",
            textTransform: "uppercase",
          }}
        >
          Goalzen
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "1px",
            color: "#00f0ff",
            textTransform: "uppercase",
          }}
        >
          Live Sports · Scores · Highlights
        </div>
      </div>
    </div>
  );
}

/**
 * Poster/banner carousel driven only by dynamic banners from FUSION.json.
 * Falls back to a pure CSS gradient banner when no banners are provided.
 */
export function PosterCarousel({ images, hidden }: Props) {
  const list = (images || []).filter(Boolean);
  const [index, setIndex] = useState(0);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (index > 0 && index >= list.length) setIndex(0);
  }, [list.length, index]);

  useEffect(() => {
    if (list.length <= 1) return;
    const delay = index === 0 ? 4000 : 2000;
    timeout.current = setTimeout(() => {
      setIndex((prev) => (prev + 1 >= list.length ? 0 : prev + 1));
    }, delay);
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, [index, list.length]);

  if (hidden) return null;
  if (list.length === 0) return <GradientBanner />;

  return (
    <div id="poster-carousel-container" style={containerStyle}>
      <div
        id="poster-slides-wrapper"
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          transition: "transform 0.5s ease-in-out",
          transform: `translateX(-${index * 100}%)`,
        }}
      >
        {list.map((src, idx) => (
          <div className="poster-slide" key={`${src}-${idx}`}>
            <img
              referrerPolicy="no-referrer"
              src={src}
              alt="Goalzen banner"
              onError={onImgFallback}
            />
          </div>
        ))}
      </div>
      <div
        id="poster-dots"
        style={{
          position: "absolute",
          bottom: 10,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8,
          zIndex: 10,
        }}
      >
        {list.map((_, idx) => (
          <div
            key={idx}
            className="poster-dot"
            onClick={() => setIndex(idx)}
            style={{
              background: idx === index ? "#39ff14" : "rgba(255, 255, 255, 0.5)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
