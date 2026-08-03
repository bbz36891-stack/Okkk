import { memo } from "react";
import { formatHMS, matchWindow, onImgHide, safeUrl } from "../lib/utils";
import type { Match } from "../types";

interface Props {
  match: Match;
  now: number;
  onClick: () => void;
}

function MatchCardBase({ match, now, onClick }: Props) {
  const { start, end } = matchWindow(match);
  const status = now >= start && now <= end ? "live" : now > end ? "recent" : "upcoming";

  const dateObj = new Date(start);
  const dateStr = dateObj
    .toLocaleDateString([], { day: "2-digit", month: "short" })
    .toUpperCase();
  const timeStr = dateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const matchTitle = match.cat || match.title || "";
  const isLong = (matchTitle + (match.eventInfo.eventName || "")).length > 25;

  return (
    <div className={`m-card ${status}`} onClick={onClick}>
      <div className="mc-header">
        <div className="mc-header-left">
          <img
            referrerPolicy="no-referrer"
            className="mc-league-logo"
            src={safeUrl(match.league_logo)}
            alt=""
            onError={onImgHide}
          />
          <span className={`mc-league-text${isLong ? " scroll-active" : ""}`}>
            {matchTitle} | {match.eventInfo.eventName}
          </span>
        </div>
        <span className="mc-timer-top">
          {dateStr} {timeStr}
        </span>
      </div>
      <div className="mc-teams">
        <div className="mc-team">
          <img
            referrerPolicy="no-referrer"
            className="mc-logo"
            src={safeUrl(match.eventInfo.teamAFlag)}
            alt={match.eventInfo.teamA}
            onError={onImgHide}
          />
          <span className="mc-name">{match.eventInfo.teamA}</span>
        </div>
        <div className="mc-status-center">
          {now < start ? (
            <>
              <span className="vs-txt-main">VS</span>
              <span className="st-label">Starting In</span>
              <span className="st-time">{formatHMS(start - now)}</span>
            </>
          ) : now <= end ? (
            <>
              <div className="live-dot-blob" />
              <span className="live-txt-red">LIVE</span>
              <span className="st-label" style={{ marginTop: 2 }}>
                Started In
              </span>
              <span className="st-time">{formatHMS(now - start)}</span>
            </>
          ) : (
            <>
              <span className="vs-txt-main">VS</span>
              <span style={{ color: "#ff4757", fontSize: 11, fontWeight: 900 }}>
                FINISHED
              </span>
            </>
          )}
        </div>
        <div className="mc-team">
          <img
            referrerPolicy="no-referrer"
            className="mc-logo"
            src={safeUrl(match.eventInfo.teamBFlag)}
            alt={match.eventInfo.teamB}
            onError={onImgHide}
          />
          <span className="mc-name">{match.eventInfo.teamB}</span>
        </div>
      </div>
    </div>
  );
}

export const MatchCard = memo(MatchCardBase);
