import { memo, useMemo, type MouseEvent } from "react";
import { useStore } from "../store";
import { ChannelCard } from "./ChannelCard";

/**
 * Isolated player frame: re-renders only when the stream markup actually
 * changes, so unrelated store updates (clock ticks, filters) can never
 * remount the iframe and restart playback.
 */
const PlayerFrame = memo(function PlayerFrame({ html }: { html: string }) {
  return (
    <div
      id="sports-player-container"
      className="video-box"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});

/** Dedicated player page with server switcher and suggested channels grid. */
export function SportsPlayerPage() {
  const {
    sportsPlayer,
    closeSportsPlayer,
    switchPlayerLink,
    sportsChannels,
    vipList,
    openLinks,
    playVipChannel,
  } = useStore();

  const context = sportsPlayer?.context;

  const suggestions = useMemo(() => {
    if (!context) return null;
    if (context === "vip") {
      return vipList.map((ch, idx) => (
        <ChannelCard
          key={`sv-${ch.Name || ch.name}-${idx}`}
          name={ch.Name || ch.name || "VIP Channel"}
          logo={ch.Logo_url}
          onClick={() => playVipChannel(ch)}
        />
      ));
    }
    return sportsChannels
      .filter((ch) => ch.visible)
      .map((ch, idx) => (
        <ChannelCard
          key={`ss-${ch.name}-${idx}`}
          name={ch.name}
          logo={ch.logo}
          onClick={() => openLinks(ch)}
        />
      ));
  }, [context, sportsChannels, vipList, openLinks, playVipChannel]);

  const onSwitch = (e: MouseEvent<HTMLButtonElement>, i: number) => {
    e.preventDefault();
    e.stopPropagation();
    switchPlayerLink(i);
  };

  return (
    <div id="sports-player-page" style={{ display: sportsPlayer ? "flex" : "none" }}>
      <div className="sticky-player-header">
        <button className="back-btn" onClick={closeSportsPlayer}>
          ← BACK TO CHANNEL LIST
        </button>

        <PlayerFrame html={sportsPlayer?.iframeHtml || ""} />

        <div
          id="sports-player-links-wrapper"
          className="player-links-bar"
          style={{
            display: sportsPlayer && sportsPlayer.links.length > 1 ? "block" : "none",
          }}
        >
          <div id="new-link-list">
            {sportsPlayer?.links.map((l, i) => (
              <button
                key={`${l.name}-${i}`}
                type="button"
                className={`link-btn${i === sportsPlayer.activeLinkIdx ? " active" : ""}`}
                onClick={(e) => onSwitch(e, i)}
              >
                {l.name}
              </button>
            ))}
          </div>
        </div>

        <div
          className="promo-bar"
          onClick={() => window.open("https://goalzen.site", "_blank")}
        >
          Thank you for choosing Goalzen for your ultimate sports streaming experience
        </div>
      </div>

      <div className="player-below-content">
        <div className="container">
          <div style={{ padding: "12px 10px 0 10px", textAlign: "center" }}>
            <div id="sports-player-title" className="now-playing-red">
              <div className="live-dot-blob" />{" "}
              {sportsPlayer?.title || "NOW PLAYING STREAM"}
            </div>
          </div>

          <div className="suggest-box-cyber">
            <div
              style={{
                fontSize: 12,
                fontWeight: 900,
                color: "#00f0ff",
                textTransform: "uppercase",
                marginBottom: 10,
                borderLeft: "3px solid #00f0ff",
                paddingLeft: 8,
              }}
            >
              Suggested Channels
            </div>
            <div id="suggest-grid" className="grid">
              {suggestions}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
