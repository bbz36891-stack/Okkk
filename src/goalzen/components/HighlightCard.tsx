import { memo } from "react"; import { extractTeamData } from
"../lib/highlights"; import { hlSafeLogo, onImgFallback, onImgHide } from
"../lib/utils"; import type { HighlightMatch } from "../types";

/**

  - Highlights card — images intentionally DO NOT set referrerPolicy,
  - they are served through the dedicated highlights image proxy. */ function
    HighlightCardBase({ match, onOpen, }: { match: HighlightMatch; onOpen: () =>
    void; }) { const t = extractTeamData(match);

/* Layout A — generic / missing team data: single cover banner */ if
(t.isGeneric) { const cover = t.cover ? hlSafeLogo(t.cover) : ""; return ( 
{cover ? ( <img className="hl-cover" src={cover} alt={t.title || t.competition}
loading="lazy" decoding="async" onError={onImgHide} /> ) : null}   {t.homeName
&& t.awayName ? ${t.homeName} vs ${t.awayName} : t.title || "Match Highlights"} 
 {t.competition ? {t.competition} : null} {t.date ? {t.date} : null}    ); }

/* Layout B — full two-team layout */ return (    {t.cover ? (  ) : null}
{t.competition || t.title}  <span className="mc-timer-top" style={{ color:
"#00f0ff" }}> {t.date}     {t.homeLogo ? (  ) : null} {t.homeName}   <div
style={{ display: "flex", alignItems: "center", gap: 8 }}> {t.homeScore} <span
style={{ color: "#555", fontSize: 14, fontWeight: 900 }}>- {t.awayScore}  <span
style={{ fontSize: 10, fontWeight: 800, color: "#00f0ff", textTransform:
"uppercase", marginTop: 4, }} > {t.status}    {t.awayLogo ? (  ) : null}
{t.awayName}    ); }

export const HighlightCard = memo(HighlightCardBase);
