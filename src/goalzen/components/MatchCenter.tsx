import { useEffect, useRef } from "react";
import { useStore } from "../store";
import { categoryLogo, encodeStream, onImgFallback, safeUrl } from "../lib/utils";
import { FALLBACK_LOGO } from "../lib/constants";

/**
 * Match Center (details page).
 * Desktop fix: the panel is centered with mx-auto and the inner content is
 * constrained to max-w-5xl so it never shifts to the left edge.
 */
export function MatchCenter() {
  const { selectedMatch, goHome, playIframe } = useStore();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedMatch && pageRef.current) pageRef.current.scrollTop = 0;
  }, [selectedMatch]);

  const match = selectedMatch;
  const start = match ? new Date(match.eventInfo.startTime) : null;
  const timeStr = start
    ? `${start.toLocaleDateString([], {
        day: "numeric",
        month: "short",
        year: "numeric",
      })} | ${start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`
    : "";

  const matchTitle = match ? match.cat || match.title || "" : "";

  return (
    <div id="details-page" ref={pageRef}>
      <div className="dp-header-fusion">
        <div className="dp-header-inner">
          <i
            className="fa-solid fa-arrow-left"
            style={{ fontSize: 20, cursor: "pointer" }}
            onClick={goHome}
          />
          <span className="dp-title-center">Match Center</span>
          <div style={{ width: 20 }} />
        </div>
      </div>

      <div id="details-content" className="dp-inner">
        {match && (
          <>
            <div style={{ margin: 5 }}>
              <div className="dp-card-shining">
                <img
                  referrerPolicy="no-referrer"
                  className="dp-league-logo-top"
                  src={categoryLogo(matchTitle, match.league_logo)}
                  alt={matchTitle}
                  onError={onImgFallback}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div className="mc-team">
                    <img
                      referrerPolicy="no-referrer"
                      className="dp-logo-fusion"
                      src={safeUrl(match.eventInfo.teamAFlag) || FALLBACK_LOGO}
                      alt={match.eventInfo.teamA}
                      onError={onImgFallback}
                    />
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 13,
                        marginTop: 8,
                        color: "#000",
                      }}
                    >
                      {match.eventInfo.teamA}
                    </div>
                  </div>
                  <div className="dp-vs-fusion">VS</div>
                  <div className="mc-team">
                    <img
                      referrerPolicy="no-referrer"
                      className="dp-logo-fusion"
                      src={safeUrl(match.eventInfo.teamBFlag) || FALLBACK_LOGO}
                      alt={match.eventInfo.teamB}
                      onError={onImgFallback}
                    />
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 13,
                        marginTop: 8,
                        color: "#000",
                      }}
                    >
                      {match.eventInfo.teamB}
                    </div>
                  </div>
                </div>
                <div className="dp-bold-name">
                  <strong>
                    {matchTitle} | {match.eventInfo.eventName}
                  </strong>
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 12,
                    color: "#fff",
                    background: "#333",
                    display: "inline-block",
                    padding: "5px 14px",
                    borderRadius: 50,
                    fontWeight: 600,
                  }}
                >
                  {timeStr}
                </div>
              </div>
            </div>

            <div className="fusion-section-label">Stream Links</div>
            {match.channels_data?.map((ch, idx) => {
              const sName = ch.title || "Server " + (idx + 1);
              const hqText = `${match.eventInfo.teamA} VS ${match.eventInfo.teamB}`;
              const tappedName = `${hqText} (${sName})`;
              return (
                <div
                  className="fusion-server-card"
                  key={`${sName}-${idx}`}
                  onClick={() => playIframe(encodeStream(ch.link), tappedName)}
                >
                  <div className="fusion-srv-left">
                    <img
                      referrerPolicy="no-referrer"
                      src={FALLBACK_LOGO}
                      className="fusion-srv-logo"
                      alt={sName}
                      onError={onImgFallback}
                    />
                    <div className="fusion-srv-txt">
                      <span className="fusion-srv-name">{sName}</span>
                      <span className="fusion-srv-hq">{hqText}</span>
                    </div>
                  </div>
                  <div className="fusion-srv-watch">
                    <i className="fa-solid fa-play" /> Watch Now
                  </div>
                </div>
              );
            })}

            <div className="fusion-legal-notice-box">
              <div className="fusion-legal-title">
                Important Legal Notice &amp; Disclaimer
              </div>
              <div className="fusion-legal-p">
                <strong>1. Content Hosting:</strong> Goalzen is an online information
                service provider. We absolutely DO NOT host, upload, create, store, or
                transmit any video content, media files, or live streams on our servers.
              </div>
              <div className="fusion-legal-p">
                <strong>2. Third-Party Links:</strong> By clicking on any link, you are
                leaving Goalzen and accessing content from third-party entities. We have
                no control over the nature, content, and availability of those sites.
              </div>
              <div className="fusion-legal-p">
                <strong>3. Intellectual Property Service Rights:</strong> All trademarks,
                logos, team names, and brand identifiers appearing on this site are the
                property of their respective owners.
              </div>
              <div className="fusion-legal-p">
                <strong>4. DMCA Compliance:</strong> We respect the Digital Millennium
                Copyright Act (DMCA). Since we do not host content, valid takedown notices
                should be directed to the host site actually hosting the file.
              </div>
              <div className="fusion-legal-p">
                <strong>5. User Responsibility:</strong> Users are responsible for ensuring
                that their use of these streams complies with their local laws and
                regulations.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
