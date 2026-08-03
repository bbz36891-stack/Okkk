import { FALLBACK_LOGO } from "../lib/constants";
import { onImgFallback } from "../lib/utils";

interface LogoProps {
  size?: number;
  textSize?: number;
  showSports?: boolean;
  glow?: string;
}

export function Logo({ size = 48, textSize, showSports = false, glow }: LogoProps) {
  return (
    <div className="logo-main">
      <img
        referrerPolicy="no-referrer"
        src={FALLBACK_LOGO}
        alt="Goalzen Logo"
        style={{ width: size, height: size, objectFit: "contain" }}
        onError={onImgFallback}
      />
      <div className="logo-text-col">
        <span
          className="logo-fusion-text"
          style={{
            ...(textSize ? { fontSize: `${textSize}px` } : {}),
            ...(glow ? { textShadow: glow } : {}),
          }}
        >
          <span className="fusion-f">G</span>
          <span className="fusion-u">O</span>
          <span className="fusion-s">A</span>
          <span className="fusion-i">L</span>
          <span className="fusion-o">Z</span>
          <span className="fusion-n">E</span>
          <span style={{ color: "#39ff14" }}>N</span>
        </span>
        {showSports && <span className="logo-sports">Sports</span>}
      </div>
    </div>
  );
}
