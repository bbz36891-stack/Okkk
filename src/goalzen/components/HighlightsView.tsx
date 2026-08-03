import { useEffect, useState, type CSSProperties } from "react";
import { useStore } from "../store";
import { HighlightCard } from "./HighlightCard";

const loadMoreStyle: CSSProperties = {
  display: "block",
  width: "100%",
  padding: 12,
  margin: "15px 0 30px 0",
  background: "#00f0ff",
  color: "#000",
  fontWeight: 900,
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  textTransform: "uppercase",
  fontSize: 13,
  letterSpacing: "0.5px",
};

export function HighlightsView({ hidden }: { hidden?: boolean }) {
  const { highlights, openHighlight } = useStore();
  const [query, setQuery] = useState("");

  // Revert to the main feed automatically once the input is emptied.
  useEffect(() => {
    if (query.trim() === "" && highlights.searchMode) highlights.clearSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const runSearch = () => {
    const term = query.trim();
    if (!term) {
      highlights.clearSearch();
      return;
    }
    void highlights.search(term);
  };

  return (
    <div
      id="highlights-view"
      className={hidden ? "hidden-view" : undefined}
      style={{ padding: "0 15px" }}
    >
      <div
        className="channel-search-wrap"
        style={{ margin: "10px 0 15px 0", position: "relative" }}
      >
        <input
          type="text"
          id="highlights-search-input"
          placeholder="Search team or league name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") runSearch();
          }}
          style={{
            width: "100%",
            padding: "12px 40px 12px 15px",
            borderRadius: 8,
            border: "1px solid #00f0ff",
            background: "#0b0f19",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            transition: "border 0.2s",
          }}
        />
        <i
          className="fa-solid fa-magnifying-glass"
          onClick={runSearch}
          role="button"
          aria-label="Search highlights"
          style={{
            position: "absolute",
            right: 15,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#00f0ff",
            fontSize: 16,
            cursor: "pointer",
          }}
        />
      </div>

      <div
        id="hl-loader"
        style={{ display: highlights.loading || highlights.error ? "block" : "none" }}
      >
        {highlights.loading ? "FETCHING HIGHLIGHTS..." : highlights.error}
      </div>

      <div
        id="highlights-grid"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 15,
          paddingBottom: 15,
        }}
      >
        {highlights.list.map((m, idx) => (
          <HighlightCard
            key={`${m.title || "hl"}-${idx}`}
            match={m}
            onOpen={() => openHighlight(m)}
          />
        ))}
      </div>

      <button
        id="highlights-load-more-btn"
        onClick={() => void highlights.loadMore()}
        style={{
          ...loadMoreStyle,
          display: highlights.hasMore && !highlights.loading ? "block" : "none",
        }}
      >
        Load More Videos
      </button>
    </div>
  );
}
