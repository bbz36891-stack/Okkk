import { useMemo, useState } from "react";
import { useStore } from "../store";
import { CATEGORY_LOGOS, FALLBACK_LOGO } from "../lib/constants";
import { onImgFallback } from "../lib/utils";
import { Logo } from "./Logo";

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, matches, filterByLeague, filterBySubcategory } =
    useStore();
  const [openCat, setOpenCat] = useState<string | null>(null);

  /** Category -> leagues accordion groups (1:1 with populateSidebarLeagues) */
  const groups = useMemo(() => {
    const map: Record<string, string[]> = {};
    matches.forEach((match) => {
      const cat = match.cat || match.title || "Other";
      const league = match.eventInfo.eventName || "";
      if (!map[cat]) map[cat] = [];
      if (league && !map[cat]!.includes(league)) map[cat]!.push(league);
    });
    return Object.keys(map)
      .sort()
      .map((cat) => ({ cat, leagues: map[cat] || [] }));
  }, [matches]);

  return (
    <>
      <div
        className={`sidebar-overlay${sidebarOpen ? " active" : ""}`}
        onClick={toggleSidebar}
      />
      <div
        className={`sidebar-panel${sidebarOpen ? " active" : ""}`}
        id="SIDEBAR_MENU_AREA"
      >
        <div className="sb-atv-header">
          <div style={{ transform: "scale(0.95)", marginBottom: 12 }}>
            <Logo textSize={36} glow="0 0 15px rgba(57, 255, 20, 0.3)" />
          </div>
          <div className="sb-atv-desc">
            Select a League from active events to filter matches:
          </div>
          <div className="sb-red-line" style={{ background: "#39ff14" }} />
        </div>
        <ul className="sb-atv-list" id="sidebar-leagues-list">
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                filterByLeague("all");
              }}
            >
              <i className="fa-solid fa-list" style={{ color: "#39ff14" }} /> All Events
            </a>
          </li>

          {groups.map(({ cat, leagues }) => {
            const normalizedCat = cat.toLowerCase().trim();
            const logoUrl = CATEGORY_LOGOS[normalizedCat] || FALLBACK_LOGO;
            const expanded = openCat === cat;
            return (
              <li className="sidebar-cat-item" key={cat}>
                <div
                  className="sidebar-cat-header"
                  onClick={() => setOpenCat(expanded ? null : cat)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "15px 25px",
                    borderBottom: "1px solid #222",
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: 15,
                    color: "#eee",
                    transition: "background 0.2s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <img
                      referrerPolicy="no-referrer"
                      src={logoUrl}
                      alt={cat}
                      style={{
                        width: 24,
                        height: 24,
                        objectFit: "contain",
                        borderRadius: 4,
                        border: "1px solid #333",
                      }}
                      onError={onImgFallback}
                    />
                    <span>{cat}</span>
                  </div>
                  <i
                    className="fa-solid fa-chevron-down"
                    style={{
                      fontSize: 12,
                      transition: "transform 0.2s",
                      color: "#39ff14",
                      transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </div>
                <ul
                  className="sidebar-sub-list"
                  style={{
                    display: expanded ? "block" : "none",
                    background: "#111",
                    listStyle: "none",
                  }}
                >
                  {leagues.map((league) => (
                    <li key={league}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          filterBySubcategory(cat, league);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "12px 30px",
                          fontSize: 13.5,
                          color: "#ccc",
                          borderBottom: "1px solid #1a1a1a",
                          fontWeight: 600,
                        }}
                      >
                        <i
                          className="fa-solid fa-play"
                          style={{ fontSize: 8, color: "#39ff14" }}
                        />{" "}
                        {league}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
