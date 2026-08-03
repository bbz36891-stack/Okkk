export interface EventInfo {
  teamA: string;
  teamB: string;
  teamAFlag?: string;
  teamBFlag?: string;
  eventName?: string;
  startTime: string;
  endTime?: string;
  isHot?: string | number;
}

export interface MatchChannel {
  title?: string;
  link: string;
}

export interface Match {
  cat?: string;
  title?: string;
  league_logo?: string;
  eventInfo: EventInfo;
  channels_data: MatchChannel[];
}

export interface StreamLink {
  name: string;
  link: string;
}

export interface SportsChannel {
  name: string;
  logo?: string;
  visible?: boolean;
  stream_links: StreamLink[];
}

export interface SportsCategory {
  name?: string;
  channels_data: SportsChannel[];
}

export interface VipChannel {
  Name?: string;
  name?: string;
  Logo_url?: string;
  Stream_url?: string;
  Stream_link?: string;
  link?: string;
}

export interface AdsControl {
  Ads_link: string;
  Status: string;
}

export interface FusionResponse {
  Ads_control?: AdsControl;
  Banners?: string[];
  VIP_channel?: VipChannel[];
  SPORTS?: { categories?: SportsCategory[] };
  sports_live: { events: Match[] };
}

export interface HighlightTeam {
  name?: string;
  logo?: string;
  score?: number | string;
}

export interface HighlightStream {
  part?: string;
  m3u8_url: string;
}

export interface TimelineEvent {
  event_type?: string;
  time?: string;
  player?: string;
  team?: string;
  assist?: string;
  score_update?: string;
}

export interface H2HMatch {
  date?: string;
  competition?: string;
  teams_and_score?: string;
}

export interface HighlightMatch {
  title?: string;
  competition?: string;
  competition_cover?: string;
  date?: string;
  description?: string;
  events_info?: {
    home_team?: HighlightTeam;
    away_team?: HighlightTeam;
    status?: string;
  };
  streams?: HighlightStream[];
  statistics?: Record<string, unknown>;
  events_timeline?: TimelineEvent[];
  head_to_head?: { previous_matches?: H2HMatch[] };
}

export type MatchStatus = "live" | "upcoming" | "recent";
export type StatusFilter = "all" | MatchStatus;
export type ViewName = "home" | "sports" | "vip" | "highlights";
export type HlTab = "stats" | "timeline" | "h2h";

export interface VipSession {
  username: string;
  token: string;
  remember: boolean;
}

export interface SportsPlayerState {
  iframeHtml: string;
  title: string;
  links: StreamLink[];
  activeLinkIdx: number;
  context: "sports" | "vip";
}
