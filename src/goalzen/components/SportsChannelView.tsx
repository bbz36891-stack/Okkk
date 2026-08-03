import { useMemo, useState } from "react";
import { useStore } from "../store";
import { ChannelCard } from "./ChannelCard";

export function SportsChannelView({ hidden }: { hidden?: boolean }) {
  const { sportsChannels, sportsLoading, sportsError, openLinks } = useStore();
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.toLowerCase().trim();
    return sportsChannels.filter((ch) => {
      if (!ch.visible) return false;
      if (q && !ch.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [sportsChannels, query]);

  return (
    <div
      id="sports-channel-view"
      className={hidden ? "hidden-view" : undefined}
      style={{ padding: "0 15px" }}
    >
      <div
        className="channel-search-wrap"
        style={{ margin: "10px 0 15px 0", position: "relative" }}
      >
        <input
          type="text"
          id="channel-search-input"
          placeholder="Search Channels..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 40px 12px 15px",
            borderRadius: 8,
            border: "1px solid var(--border-color)",
            background: "var(--card-bg)",
            color: "var(--text-main)",
            fontSize: 14,
            fontWeight: 600,
            transition: "border 0.2s",
          }}
        />
        <i
          className="fa-solid fa-magnifying-glass"
          style={{
            position: "absolute",
            right: 15,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-sub)",
            fontSize: 16,
          }}
        />
      </div>

      <div id="sports-loader" style={{ display: sportsLoading || sportsError ? "block" : "none" }}>
        {sportsError || "FETCHING DATA..."}
      </div>

      <div id="sports-grid" className="grid">
        {visible.map((ch, idx) => (
          <ChannelCard
            key={`${ch.name}-${idx}`}
            name={ch.name}
            logo={ch.logo}
            onClick={() => openLinks(ch)}
          />
        ))}
      </div>
    </div>
  );
}
