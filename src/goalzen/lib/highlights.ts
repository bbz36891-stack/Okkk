import { hlSafeLogo } from "./utils";
import type { HighlightMatch } from "../types";

export interface TeamData {
  homeName: string;
  awayName: string;
  homeLogo: string;
  awayLogo: string;
  homeScore: string;
  awayScore: string;
  status: string;
  competition: string;
  cover: string;
  title: string;
  date: string;
  isGeneric: boolean;
}

const PLACEHOLDERS = new Set(["home team", "away team", "home", "away", "tbd", "n/a", "-"]);

const isPlaceholder = (name?: string | null) =>
  !name || !name.trim() || PLACEHOLDERS.has(name.trim().toLowerCase());

/** Regex delimiters: vs / VS / v / - / – / | */
const TITLE_SPLIT = /\s+(?:vs\.?|VS\.?|v|[-–—|])\s+/;

function splitTitle(title?: string): [string, string] | null {
  if (!title) return null;
  const clean = title.replace(/\s*[-|–]\s*(highlights?|full match)\s*$/i, "").trim();
  const parts = clean.split(TITLE_SPLIT).map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) return [parts[0] ?? "", parts.slice(1).join(" ")];
  return null;
}

type Loose = Record<string, unknown>;

function pick(obj: unknown, key: string): unknown {
  return obj && typeof obj === "object" ? (obj as Loose)[key] : undefined;
}

function teamNode(item: HighlightMatch, side: "home_team" | "away_team"): Loose {
  const raw = item as unknown as Loose;
  return (
    (pick(pick(raw, "teams"), side) as Loose) ||
    (pick(pick(raw, "events_info"), side) as Loose) ||
    (pick(raw, side) as Loose) ||
    {}
  );
}

const str = (v: unknown) => (typeof v === "string" || typeof v === "number" ? String(v) : "");

/**
 * Safely extract team names/logos/scores from any shape of highlight payload,
 * with generic detection + title-parsing fallback.
 */
export function extractTeamData(item: HighlightMatch): TeamData {
  const raw = item as unknown as Loose;
  const home = teamNode(item, "home_team");
  const away = teamNode(item, "away_team");

  let homeName = str(home['name'] ?? home['title'] ?? raw["home_team_name"]).trim();
  let awayName = str(away['name'] ?? away['title'] ?? raw["away_team_name"]).trim();
  const homeLogoRaw = str(home['logo'] ?? home['image'] ?? raw["home_team_logo"]).trim();
  const awayLogoRaw = str(away['logo'] ?? away['image'] ?? raw["away_team_logo"]).trim();

  const genericNames = isPlaceholder(homeName) || isPlaceholder(awayName);
  const noLogos = !homeLogoRaw && !awayLogoRaw;
  let isGeneric = genericNames || noLogos;

  const title = str(raw["title"]).trim();
  if (isGeneric && title) {
    const parsed = splitTitle(title);
    if (parsed) {
      if (isPlaceholder(homeName)) homeName = parsed[0];
      if (isPlaceholder(awayName)) awayName = parsed[1];
      // names recovered, but without logos we still render the banner layout
      isGeneric = noLogos;
    }
  }

  return {
    homeName,
    awayName,
    homeLogo: homeLogoRaw ? hlSafeLogo(homeLogoRaw) : "",
    awayLogo: awayLogoRaw ? hlSafeLogo(awayLogoRaw) : "",
    homeScore: str(home['score'] ?? "") || "-",
    awayScore: str(away['score'] ?? "") || "-",
    status: str(pick(pick(raw, "events_info"), "status")) || "FT",
    competition: str(raw["competition"]),
    cover: str(raw["thumbnail_url"] || raw["competition_cover"]),
    title,
    date: str(raw["date"]),
    isGeneric,
  };
}
