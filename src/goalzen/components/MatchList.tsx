import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useStore } from "../store";
import { matchSlug } from "../lib/utils";
import { MatchCard } from "./MatchCard";

const CHUNK_SIZE = 24;

const loadMoreStyle: CSSProperties = {
  display: "block",
  width: "100%",
  padding: 12,
  margin: "15px auto 30px auto",
  background: "#39ff14",
  color: "#000",
  fontWeight: 900,
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  textTransform: "uppercase",
  fontSize: 13,
  letterSpacing: "0.5px",
};

export function MatchList({ hidden }: { hidden?: boolean }) {
  const { visibleMatches, now, openMatch } = useStore();
  const [limit, setLimit] = useState(CHUNK_SIZE);

  useEffect(() => {
    setLimit(CHUNK_SIZE);
  }, [visibleMatches.length]);

  const chunk = useMemo(
    () => visibleMatches.slice(0, limit),
    [visibleMatches, limit],
  );
  const remaining = visibleMatches.length - chunk.length;

  return (
    <div id="match-list-container" className={hidden ? "hidden-view" : undefined}>
      {visibleMatches.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "50px 20px",
            color: "var(--text-sub)",
            width: "100%",
          }}
        >
          <i
            className="fa-regular fa-calendar-times"
            style={{
              fontSize: 36,
              color: "#39ff14",
              marginBottom: 12,
              display: "block",
            }}
          />
          <p style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.5px" }}>
            No matches available currently
          </p>
        </div>
      ) : (
        <>
          {chunk.map((match) => (
            <MatchCard
              key={`${matchSlug(match)}-${match.eventInfo.startTime}`}
              match={match}
              now={now}
              onClick={() => openMatch(match)}
            />
          ))}
          {remaining > 0 ? (
            <button
              onClick={() => setLimit((n) => n + CHUNK_SIZE)}
              style={loadMoreStyle}
            >
              Load More ({remaining} left)
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}
