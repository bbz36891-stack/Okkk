import { useMemo, useState } from "react";
import { useStore } from "../store";
import { ChannelCard } from "./ChannelCard";

export function VipChannelView({ hidden }: { hidden?: boolean }) {
  const { vipList, vip, playVipChannel } = useStore();
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.toLowerCase().trim();
    return vipList.filter((ch) => {
      const chName = ch.Name || ch.name || "VIP Channel";
      if (q && !chName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [vipList, query]);

  /* VIP content stays hidden whenever there is no verified session */
  if (!vip.session) return null;

  return (
    <div
      id="vip-channel-view"
      className={hidden ? "hidden-view" : undefined}
      style={{ padding: "0 15px" }}
    >
      <div
        id="vip-user-bar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#0f172a",
          border: "1px solid #00d2ff",
          padding: "10px 15px",
          borderRadius: 8,
          margin: "10px 0 15px 0",
          fontSize: 12,
          fontWeight: 800,
          color: "#fff",
        }}
      >
        <div>
          <i className="fa-solid fa-user-shield" style={{ color: "#00d2ff", marginRight: 6 }} />{" "}
          <span id="vip-logged-user-name">{vip.session.username.toUpperCase()}</span>
        </div>
        <button
          onClick={() => void vip.logout()}
          style={{
            background: "#ef4444",
            color: "#fff",
            border: "none",
            padding: "6px 12px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 900,
            cursor: "pointer",
            textTransform: "uppercase",
          }}
        >
          <i className="fa-solid fa-right-from-bracket" /> Log Out
        </button>
      </div>

      <div className="channel-search-wrap" style={{ margin: "0 0 15px 0", position: "relative" }}>
        <input
          type="text"
          id="vip-search-input"
          placeholder="Search VIP Channels..."
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

      <div id="vip-grid" className="grid">
        {visible.length === 0 ? (
          <div
            style={{
              gridColumn: "1/-1",
              textAlign: "center",
              padding: 30,
              color: "#888",
              fontWeight: "bold",
            }}
          >
            No VIP Channels Available
          </div>
        ) : (
          visible.map((ch, idx) => (
            <ChannelCard
              key={`${ch.Name || ch.name}-${idx}`}
              name={ch.Name || ch.name || "VIP Channel"}
              logo={ch.Logo_url}
              onClick={() => playVipChannel(ch)}
            />
          ))
        )}
      </div>
    </div>
  );
}
