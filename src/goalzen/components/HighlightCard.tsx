import { memo } from "react";
import { extractTeamData } from "../lib/highlights";
import { hlSafeLogo, onImgFallback, onImgHide } from "../lib/utils";
import type { HighlightMatch } from "../types";

/**
 * Highlights card — images intentionally DO NOT set referrerPolicy,
 * they are served through the dedicated highlights image proxy.
 */
function HighlightCardBase({
  match,
  onOpen,
}: {
  match: HighlightMatch;
  onOpen: () => void;
}) {
  const t = extractTeamData(match);

  /* Layout A — generic / missing team data: single cover banner */
  if (t.isGeneric) {
    const cover = t.cover ? hlSafeLogo(t.cover) : "";
    return (
      <div className="hl-card hl-card-generic" onClick={onOpen}>
        {cover ? (
          <img
            className="hl-cover"
            src={cover}
            alt={t.title || t.competition}
            loading="lazy"
            decoding="async"
            onError={onImgHide}
          />
        ) : null}
        <div className="hl-generic-body">
          <span className="hl-generic-title">
            {t.homeName && t.awayName
              ? `${t.homeName} vs ${t.awayName}`
              : t.title || "Match Highlights"}
          </span>
          <div className="hl-generic-meta">
            {t.competition ? <span>{t.competition}</span> : null}
            {t.date ? <span>{t.date}</span> : null}
          </div>
        </div>
      </div>
    );
  }

  /* Layout B — full two-team layout */
  return (
    <div className="hl-card" onClick={onOpen}>
      <div className="mc-header">
        <div className="mc-header-left">
          {t.cover ? (
            <img
              className="mc-league-logo"
              src={hlSafeLogo(t.cover)}
              alt={t.competition}
              loading="lazy"
              decoding="async"
              onError={onImgHide}
            />
          ) : null}
          <span className="mc-league-text">{t.competition || t.title}</span>
        </div>
        <span className="mc-timer-top" style={{ color: "#00f0ff" }}>
          {t.date}
        </span>
      </div>
      <div className="mc-teams">
        <div className="mc-team">
          {t.homeLogo ? (
            <img
              className="mc-logo"
              src={t.homeLogo}
              alt={t.homeName}
              loading="lazy"
              decoding="async"
              onError={onImgFallback}
            />
          ) : null}
          <span className="mc-name">{t.homeName}</span>
        </div>
        <div className="mc-status-center">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="hl-score">{t.homeScore}</span>
            <span style={{ color: "#555", fontSize: 14, fontWeight: 900 }}>-</span>
            <span className="hl-score">{t.awayScore}</span>
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: "#00f0ff",
              textTransform: "uppercase",
              marginTop: 4,
            }}
          >
            {t.status}
          </span>
        </div>
        <div className="mc-team">
          {t.awayLogo ? (
            <img
              className="mc-logo"
              src={t.awayLogo}
              alt={t.awayName}
              loading="lazy"
              decoding="async"
              onError={onImgFallback}
            />
          ) : null}
          <span className="mc-name">{t.awayName}</span>
        </div>
      </div>
    </div>
  );
}

export const HighlightCard = memo(HighlightCardBase);
