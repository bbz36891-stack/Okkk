import { FALLBACK_LOGO, LOGO_PROXY, CATEGORY_LOGOS } from "./constants";
import type { AdsControl, Match, MatchStatus } from "../types";

/** http -> https + sofascore image host sanitizer (1:1 with original safeUrl) */
export function safeUrl(url?: string | null): string {
  if (!url) return "";
  let secureUrl = url;
  if (secureUrl.startsWith("http://")) {
    secureUrl = secureUrl.replace("http://", "https://");
  }
  if (secureUrl.includes("api.sofascore.com")) {
    secureUrl = secureUrl.replace("api.sofascore.com", "img.sofascore.com");
  }
  return secureUrl;
}

/** Highlights logo proxy sanitizer (1:1 with original hlSafeLogo) */
export function hlSafeLogo(url?: string | null): string {
  if (!url) return FALLBACK_LOGO;
  const cleaned = safeUrl(url);
  return `${LOGO_PROXY}${encodeURIComponent(cleaned)}`;
}

export function formatHMS(ms: number): string {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${h > 0 ? h + ":" : ""}${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
}

export function matchWindow(match: Match): { start: number; end: number } {
  const start = new Date(match.eventInfo.startTime).getTime();
  const end = match.eventInfo.endTime
    ? new Date(match.eventInfo.endTime).getTime()
    : start + 7200000;
  return { start, end };
}

export function getStatus(match: Match, now: number): MatchStatus {
  const { start, end } = matchWindow(match);
  return now >= start && now <= end ? "live" : now > end ? "recent" : "upcoming";
}

export function matchSlug(match: Match): string {
  return `${match.eventInfo.teamA}-vs-${match.eventInfo.teamB}`
    .replace(/\s+/g, "-")
    .toLowerCase();
}

export function categoryLogo(matchTitle: string, leagueLogo?: string): string {
  return CATEGORY_LOGOS[matchTitle.toLowerCase().trim()] || safeUrl(leagueLogo) || FALLBACK_LOGO;
}

/* ------------------------------------------------------------------ */
/* Ad click counter trigger system (1:1 with original)                */
/* ------------------------------------------------------------------ */
let adsControl: AdsControl = { Ads_link: "", Status: "no" };
let serverClickCounter = 0;

export function setAdsControl(control?: AdsControl | null) {
  if (control) adsControl = control;
}

export function triggerAdIfNeeded() {
  if (!adsControl || adsControl.Status !== "yes" || !adsControl.Ads_link) return;
  serverClickCounter++;
  if (serverClickCounter === 2 || (serverClickCounter > 2 && (serverClickCounter - 2) % 3 === 0)) {
    window.open(adsControl.Ads_link, "_blank");
  }
}

/** Base64 iframe stream decoder (1:1 with original atob/btoa usage) */
export function encodeStream(link: string): string {
  try {
    return btoa(link);
  } catch {
    return "";
  }
}

export function decodeStream(encoded: string): string {
  try {
    return atob(encoded);
  } catch {
    return "";
  }
}

export function onImgFallback(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (img.src !== FALLBACK_LOGO) img.src = FALLBACK_LOGO;
}

export function onImgHide(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = "none";
}
