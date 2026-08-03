/**
 * Framework-agnostic renderers (vanilla JS/DOM) for the same data model used by
 * the React components. Useful for embedding the lists outside React.
 *
 * Performance rules applied here:
 *  - DocumentFragment batching (one DOM commit per chunk, never innerHTML in a loop)
 *  - Chunked rendering with a "Load More" button (CHUNK_SIZE items at a time)
 *
 * Referrer policy rules:
 *  - highlightCardHTML()  -> NO referrerpolicy (images go through the proxy API)
 *  - genericCardHTML()    -> NO referrerpolicy (highlights section)
 *  - siteImageHTML()      -> referrerpolicy="no-referrer" (events, channels, VIP, banners)
 */
import { extractTeamData } from "./highlights";
import { hlSafeLogo, safeUrl } from "./utils";
import type { HighlightMatch } from "../types";

export const CHUNK_SIZE = 24;

const esc = (v: unknown) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );

/** General site image — ALWAYS no-referrer (NOT for the highlights section). */
export function siteImageHTML(url?: string | null, alt = "", cls = ""): string {
  return `<img class="${esc(cls)}" src="${esc(safeUrl(url))}" alt="${esc(alt)}"
    referrerpolicy="no-referrer" loading="lazy" decoding="async"
    onerror="this.style.display='none'">`;
}

/** Layout A — generic card (cover banner + title + competition + date). */
function genericCardHTML(t: ReturnType<typeof extractTeamData>): string {
  const cover = t.cover ? hlSafeLogo(t.cover) : "";
  const name =
    t.homeName && t.awayName ? `${t.homeName} vs ${t.awayName}` : t.title || "Match Highlights";
  return `
    <div class="hl-card hl-card-generic">
      ${cover ? `<img class="hl-cover" src="${esc(cover)}" alt="${esc(name)}" loading="lazy" decoding="async" onerror="this.style.display='none'">` : ""}
      <div class="hl-generic-body">
        <span class="hl-generic-title">${esc(name)}</span>
        <div class="hl-generic-meta">
          ${t.competition ? `<span>${esc(t.competition)}</span>` : ""}
          ${t.date ? `<span>${esc(t.date)}</span>` : ""}
        </div>
      </div>
    </div>`;
}

/** Layout B — two-team card. Empty logos are omitted, not rendered broken. */
function teamsCardHTML(t: ReturnType<typeof extractTeamData>): string {
  const logo = (src: string, alt: string) =>
    src
      ? `<img class="mc-logo" src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async" onerror="this.style.display='none'">`
      : "";
  return `
    <div class="hl-card">
      <div class="mc-header">
        <div class="mc-header-left">
          ${t.cover ? `<img class="mc-league-logo" src="${esc(hlSafeLogo(t.cover))}" alt="${esc(t.competition)}" loading="lazy" decoding="async" onerror="this.style.display='none'">` : ""}
          <span class="mc-league-text">${esc(t.competition || t.title)}</span>
        </div>
        <span class="mc-timer-top">${esc(t.date)}</span>
      </div>
      <div class="mc-teams">
        <div class="mc-team">${logo(t.homeLogo, t.homeName)}<span class="mc-name">${esc(t.homeName)}</span></div>
        <div class="mc-status-center">
          <div class="hl-scoreline">
            <span class="hl-score">${esc(t.homeScore)}</span><span>-</span><span class="hl-score">${esc(t.awayScore)}</span>
          </div>
          <span class="hl-status">${esc(t.status)}</span>
        </div>
        <div class="mc-team">${logo(t.awayLogo, t.awayName)}<span class="mc-name">${esc(t.awayName)}</span></div>
      </div>
    </div>`;
}

export function highlightCardHTML(item: HighlightMatch): string {
  const t = extractTeamData(item);
  return t.isGeneric ? genericCardHTML(t) : teamsCardHTML(t);
}

/**
 * Chunked, fragment-batched list renderer.
 * Renders CHUNK_SIZE items per commit and wires up a "Load More" button.
 */
export function renderHighlightList(
  container: HTMLElement,
  items: HighlightMatch[],
  options: { chunkSize?: number; loadMoreButton?: HTMLElement | null } = {},
): void {
  const chunkSize = options.chunkSize ?? CHUNK_SIZE;
  let rendered = 0;

  container.textContent = "";

  const renderChunk = () => {
    const slice = items.slice(rendered, rendered + chunkSize);
    if (!slice.length) return;

    // Build off-DOM, commit once.
    const fragment = document.createDocumentFragment();
    const buffer = document.createElement("div");
    buffer.innerHTML = slice.map(highlightCardHTML).join("");
    while (buffer.firstChild) fragment.appendChild(buffer.firstChild);
    container.appendChild(fragment);

    rendered += slice.length;
    const btn = options.loadMoreButton;
    if (btn) btn.style.display = rendered < items.length ? "block" : "none";
  };

  renderChunk();
  options.loadMoreButton?.addEventListener("click", renderChunk);
}
