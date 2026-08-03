import { memo } from "react";
import { useStore } from "../store";
import { useFakeWatching } from "../hooks/useNow";
import { Logo } from "./Logo";

/**
 * Iframe container memoized on the raw stream HTML only, so the 1s ticker
 * re-renders of the parent never re-mount / reload the running stream.
 */
const PlayerFrame = memo(function PlayerFrame({ html }: { html: string }) {
  return <div id="fusion-video-iframe-area" dangerouslySetInnerHTML={{ __html: html }} />;
});

/** Match stream player modal with animated fake viewer counter. */
export function PlayerModal() {
  const { playerStream, closePlayer, openInfo } = useStore();
  const watching = useFakeWatching(Boolean(playerStream));

  return (
    <div id="player-modal" className={playerStream ? "active" : undefined}>
      <div className="pm-fusion-close" onClick={closePlayer}>
        <i className="fa-solid fa-times" />
      </div>

      <div className="pm-top-info">
        <div style={{ transform: "scale(0.95)", marginBottom: 5 }}>
          <Logo textSize={36} glow="0 0 20px rgba(57, 255, 20, 0.4)" />
        </div>

        <div style={{ margin: "15px 0" }}>
          <div
            id="player-current-channel-box"
            style={{
              background: "#051a05",
              color: "#39ff14",
              border: "1.5px solid #39ff14",
              padding: "10px 20px",
              borderRadius: 50,
              fontWeight: 800,
              fontSize: 14,
              textTransform: "uppercase",
              letterSpacing: 1,
              display: playerStream ? "inline-block" : "none",
            }}
          >
            {playerStream?.name || "STREAMING LIVE"}
          </div>
        </div>

        <div className="fake-live-wrap">
          <div className="fake-counter-pill">
            <div className="fake-dot-blink" /> <span id="fake-watching-fusion">
              {watching}
            </span>{" "}
            WATCHING LIVE
          </div>
        </div>
      </div>

      <PlayerFrame html={playerStream?.html || ""} />

      <div className="fusion-audio-instruction">
        If the audio is not playing, please click the volume icon 🔊 on the video player.
      </div>

      <div className="fusion-player-footer-final">
        <div className="apf-col">
          <div className="apf-h">About Us</div>
          <div className="apf-p">
            Your ultimate destination for live sports coverage. Get the latest scores,
            schedules, and streams for Football, Cricket, and major leagues worldwide. Our
            platform is optimized for seamless performance across all devices.
          </div>
        </div>
        <div className="apf-col">
          <div className="apf-h">Learn More</div>
          <ul className="apf-ul">
            <li onClick={() => openInfo("about")}>About Goalzen</li>
            <li onClick={() => openInfo("disclaimer")}>Disclaimer Policy</li>
            <li onClick={() => openInfo("privacy")}>Privacy Policy</li>
            <li onClick={() => openInfo("contact")}>Contact Support</li>
          </ul>
        </div>
        <div className="apf-col">
          <div className="apf-h">Newsletter</div>
          <div className="apf-p">
            Stay up to date with the latest match schedules and relevant sporting updates
            from our team.
          </div>
          <div className="news-row">
            <input type="email" placeholder="Email Address" className="news-in-field" />
            <button className="news-bt-send">
              <i className="fa-solid fa-paper-plane" />
            </button>
          </div>
        </div>
        <div className="apf-copy-line">Copyright © 2026 Goalzen. Managed by Goalzen</div>
      </div>
    </div>
  );
}
