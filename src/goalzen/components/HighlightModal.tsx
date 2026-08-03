import { useEffect, useRef, useState } from "react";
import { useStore } from "../store";
import { HLS_PLAYER } from "../lib/constants";
import { hlSafeLogo, onImgFallback, triggerAdIfNeeded } from "../lib/utils";
import type { HlTab } from "../types";

function StatsTab() {
  const { activeHighlight } = useStore();
  const stats = (activeHighlight?.statistics || {}) as Record<string, unknown>;
  const keys = Object.keys(stats);
  if (keys.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 20, color: "#888" }}>
        No statistics available.
      </div>
    );
  }
  const homeTeamName = activeHighlight?.events_info?.home_team?.name || "Home";
  const awayTeamName = activeHighlight?.events_info?.away_team?.name || "Away";

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: 800,
          fontSize: 12,
          color: "#00f0ff",
          marginBottom: 12,
          padding: "0 5px",
        }}
      >
        <span>{homeTeamName}</span>
        <span>STATISTIC</span>
        <span>{awayTeamName}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {keys.map((k) => {
          const label = k.replace(/_/g, " ").toUpperCase();
          const valObj = stats[k];
          let valA: string | number = "-";
          let valB: string | number = "-";
          if (typeof valObj === "object" && valObj !== null) {
            const sub = valObj as Record<string, string | number>;
            const subKeys = Object.keys(sub);
            if (subKeys.length >= 2) {
              valA = sub[subKeys[0]!] ?? "-";
              valB = sub[subKeys[1]!] ?? "-";
            }
          } else if (typeof valObj === "string" || typeof valObj === "number") {
            valA = valObj;
            valB = valObj;
          }
          return (
            <div key={k} style={{ background: "#1e293b", padding: "10px 12px", borderRadius: 8 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  fontWeight: 800,
                  marginBottom: 4,
                }}
              >
                <span style={{ color: "#00f0ff" }}>{valA}</span>
                <span style={{ color: "#aaa", fontSize: 11 }}>{label}</span>
                <span style={{ color: "#00f0ff" }}>{valB}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function TimelineTab() {
  const { activeHighlight } = useStore();
  const timeline = activeHighlight?.events_timeline || [];
  if (timeline.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 20, color: "#888" }}>
        No timeline events recorded.
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {timeline.map((ev, i) => {
        const type = (ev.event_type || "Event").toLowerCase();
        const icon = type.includes("goal")
          ? "⚽"
          : type.includes("yellow")
            ? "🟨"
            : type.includes("red")
              ? "🟥"
              : "⏱️";
        return (
          <div
            key={i}
            style={{
              background: "#1e293b",
              padding: "10px 12px",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 12,
              borderLeft: "3px solid #00f0ff",
            }}
          >
            <div>
              <span style={{ fontWeight: 900, color: "#00f0ff" }}>{ev.time || ""}</span>
              <span style={{ margin: "0 6px" }}>{icon}</span>
              <strong style={{ color: "#fff" }}>{ev.player || ""}</strong>{" "}
              <span style={{ color: "#aaa" }}>({ev.team || ""})</span>
              {ev.assist ? (
                <span style={{ color: "#888", fontSize: 11 }}> [Assist: {ev.assist}]</span>
              ) : null}
            </div>
            <span style={{ fontWeight: 800, color: "#39ff14" }}>{ev.score_update || ""}</span>
          </div>
        );
      })}
    </div>
  );
}

function H2HTab() {
  const { activeHighlight } = useStore();
  const prevMatches = activeHighlight?.head_to_head?.previous_matches || [];
  if (prevMatches.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 20, color: "#888" }}>
        No H2H history recorded.
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {prevMatches.map((pm, i) => (
        <div
          key={i}
          style={{
            background: "#1e293b",
            padding: "10px 12px",
            borderRadius: 8,
            fontSize: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#aaa", fontSize: 11 }}>
            {pm.date || ""} ({pm.competition || ""})
          </span>
          <span style={{ fontWeight: 800, color: "#00f0ff" }}>
            {pm.teams_and_score || ""}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Highlights modal: HLS iframe player, stream parts switcher, tabbed data and
 * the commentary block stacked directly under the tab content (desktop fix).
 */
function HighlightModalContent() {
  const { activeHighlight, closeHighlight } = useStore();
  const [tab, setTab] = useState<HlTab>("stats");
  const [partIdx, setPartIdx] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    setTab("stats");
    setPartIdx(0);
  }, [activeHighlight]);

  // Hard-stop the HLS stream and free memory when the modal unmounts.
  useEffect(() => {
    return () => {
      const frame = iframeRef.current;
      if (frame) {
        try {
          frame.src = "about:blank";
        } catch {
          /* cross-origin frame: removal below is enough */
        }
        frame.remove();
        iframeRef.current = null;
      }
    };
  }, []);


  const m = activeHighlight;
  const streams = m?.streams || [];
  const rawStream = (streams[partIdx]?.m3u8_url || "").trim();

  /* Hybrid source detection: raw HTML embed, plain page URL, or m3u8 playlist. */
  const isHtmlEmbed = /^<\s*(iframe|div|script|video)/i.test(rawStream);
  const isM3u8 = /\.m3u8(\?|#|$)/i.test(rawStream) || /m3u8/i.test(rawStream);
  const frameSrc = isHtmlEmbed
    ? ""
    : isM3u8
      ? `${HLS_PLAYER}${rawStream}`
      : rawStream;

  const homeName = m?.events_info?.home_team?.name || "Home";
  const awayName = m?.events_info?.away_team?.name || "Away";
  const homeScore = m?.events_info?.home_team?.score ?? "0";
  const awayScore = m?.events_info?.away_team?.score ?? "0";

  return (
    <div id="highlight-modal" className={m ? "active" : undefined}>
      <div className="hl-page-header">
        <button type="button" className="hl-back-btn" onClick={closeHighlight}>
          ← Back to Highlights
        </button>
        <div
          style={{
            flex: 1,
            fontSize: 12,
            fontWeight: 800,
            color: "#fff",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            textAlign: "right",
          }}
        >
          Match Highlights
        </div>
      </div>

      <div
        style={{
          padding: "15px 15px 12px 15px",
          borderBottom: "1px solid #1e293b",
          background: "#0b0f19",
          textAlign: "center",
        }}
      >
        <div
          id="hl-title-banner"
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: "#00f0ff",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            lineHeight: 1.3,
          }}
        >
          {m ? `${m.competition || ""} | ${m.title || ""}` : "MATCH HIGHLIGHTS"}
        </div>
      </div>

      <div
        id="hl-video-iframe-area"
        style={{
          width: "100%",
          aspectRatio: "16/9",
          background: "#000",
          borderBottom: "1px solid #1e293b",
          flexShrink: 0,
        }}
      >
        {isHtmlEmbed ? (
          <div
            key={rawStream}
            style={{ width: "100%", aspectRatio: "16/9" }}
            dangerouslySetInnerHTML={{ __html: rawStream }}
          />
        ) : frameSrc ? (
          <iframe
            ref={iframeRef}
            key={frameSrc}
            src={frameSrc}
            style={{ width: "100%", aspectRatio: "16/9", border: "none" }}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            title="Highlights player"
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#888",
            }}
          >
            Stream link unavailable
          </div>
        )}
      </div>

      <div
        id="hl-stream-parts"
        style={{
          display: "flex",
          gap: 8,
          padding: "10px 15px",
          overflowX: "auto",
          background: "#0f172a",
          borderBottom: "1px solid #1e293b",
          minHeight: 48,
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        {streams.map((st, sIdx) => (
          <button
            key={sIdx}
            className={`hl-part-btn${sIdx === partIdx ? " active" : ""}`}
            onClick={() => {
              triggerAdIfNeeded();
              setPartIdx(sIdx);
            }}
          >
            {st.part || `Part ${sIdx + 1}`}
          </button>
        ))}
      </div>

      <div className="hl-scroll-body">
        <div
          style={{
            padding: 15,
            background: "#0f172a",
            borderBottom: "1px solid #1e293b",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            flexShrink: 0,
          }}
        >
          <div style={{ textAlign: "center", width: "35%" }}>
            <img
              id="hl-sb-home-logo"
              src={hlSafeLogo(m?.events_info?.home_team?.logo)}
              alt={homeName}
              style={{ width: 45, height: 45, objectFit: "contain", marginBottom: 5 }}
              onError={onImgFallback}
            />
            <div id="hl-sb-home-name" style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>
              {homeName}
            </div>
          </div>
          <div style={{ textAlign: "center", width: "30%" }}>
            <div
              id="hl-sb-score"
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "#00f0ff",
                fontFamily: "'Rajdhani', sans-serif",
              }}
            >
              {homeScore} - {awayScore}
            </div>
            <div
              id="hl-sb-status"
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: "#39ff14",
                textTransform: "uppercase",
                marginTop: 3,
              }}
            >
              {m?.events_info?.status || "FT"}
            </div>
          </div>
          <div style={{ textAlign: "center", width: "35%" }}>
            <img
              id="hl-sb-away-logo"
              src={hlSafeLogo(m?.events_info?.away_team?.logo)}
              alt={awayName}
              style={{ width: 45, height: 45, objectFit: "contain", marginBottom: 5 }}
              onError={onImgFallback}
            />
            <div id="hl-sb-away-name" style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>
              {awayName}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            padding: "12px 15px",
            background: "#0b0f19",
            borderBottom: "1px solid #1e293b",
            flexShrink: 0,
          }}
        >
          <button
            className={`hl-tab-btn${tab === "stats" ? " active" : ""}`}
            onClick={() => setTab("stats")}
          >
            Statistics
          </button>
          <button
            className={`hl-tab-btn${tab === "timeline" ? " active" : ""}`}
            onClick={() => setTab("timeline")}
          >
            Timeline
          </button>
          <button
            className={`hl-tab-btn${tab === "h2h" ? " active" : ""}`}
            onClick={() => setTab("h2h")}
          >
            H2H
          </button>
        </div>

        <div id="hl-tab-content" style={{ padding: 15, background: "#0b0f19" }}>
          {tab === "stats" && <StatsTab />}
          {tab === "timeline" && <TimelineTab />}
          {tab === "h2h" && <H2HTab />}
        </div>

        <div className="hl-commentary-block">
          <div
            style={{
              fontSize: 12,
              fontWeight: 900,
              color: "#00f0ff",
              textTransform: "uppercase",
              marginBottom: 8,
              borderLeft: "3px solid #00f0ff",
              paddingLeft: 8,
            }}
          >
            Match Commentary &amp; Summary
          </div>
          <div
            id="hl-description-box"
            style={{
              fontSize: 12,
              lineHeight: 1.6,
              color: "#94a3b8",
              textAlign: "justify",
            }}
          >
            {m?.description || "No description available for this match."}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Wrapper: the modal (and therefore #hl-video-iframe-area with its HLS iframe)
 * is fully unmounted from the DOM when activeHighlight is null, so stream
 * buffering stops instantly and memory is released — no UI freeze on close.
 */
export function HighlightModal() {
  const { activeHighlight } = useStore();
  if (!activeHighlight) return null;
  return <HighlightModalContent />;
}
