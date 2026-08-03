import { useStore } from "../store";
import type { StatusFilter } from "../types";

const TABS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "upcoming", label: "Upcoming" },
  { key: "recent", label: "Recent" },
];

export function FilterTabs({ hidden }: { hidden?: boolean }) {
  const { statusFilter, filterMatch } = useStore();
  return (
    <div className={`filter-tabs${hidden ? " hidden-view" : ""}`}>
      {TABS.map((t) => (
        <button
          key={t.key}
          className={`f-btn${statusFilter === t.key ? " active" : ""}`}
          onClick={() => filterMatch(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
