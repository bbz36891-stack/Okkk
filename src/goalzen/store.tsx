import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useFusionData } from "./hooks/useFusionData";
import { useHighlights } from "./hooks/useHighlights";
import { useTheme } from "./hooks/useTheme";
import { useVipSession } from "./hooks/useVipSession";
import { useNow } from "./hooks/useNow";
import { decodeStream, getStatus, matchSlug, triggerAdIfNeeded } from "./lib/utils";
import type { InfoPage } from "./lib/constants";
import type {
  HighlightMatch,
  Match,
  SportsChannel,
  SportsPlayerState,
  StatusFilter,
  ViewName,
  VipChannel,
} from "./types";

function setQuery(mutate: (params: URLSearchParams) => void, state: unknown) {
  try {
    const url = new URL(window.location.href);
    mutate(url.searchParams);
    history.pushState(state, "", url.toString());
  } catch {
    console.log("Local security routing bypass active.");
  }
}

const VIEW_PARAMS: Record<Exclude<ViewName, "home">, string> = {
  sports: "sports-channel",
  vip: "vip-channel",
  highlights: "highlights",
};

function clearViewParams(params: URLSearchParams) {
  params.delete("sports-channel");
  params.delete("vip-channel");
  params.delete("highlights");
  params.delete("match");
}

export function useGoalzenStore() {
  const now = useNow(1000);
  const theme = useTheme();
  const data = useFusionData();
  const highlights = useHighlights();

  const [view, setView] = useState<ViewName>("home");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [leagueFilter, setLeagueFilter] = useState<string>("all");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [infoPage, setInfoPage] = useState<InfoPage | null>(null);

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [playerStream, setPlayerStream] = useState<{ html: string; name: string } | null>(
    null,
  );

  const [linkModalChannel, setLinkModalChannel] = useState<SportsChannel | null>(null);
  const [sportsPlayer, setSportsPlayer] = useState<SportsPlayerState | null>(null);

  const [activeHighlight, setActiveHighlight] = useState<HighlightMatch | null>(null);

  const vip = useVipSession(
    useCallback(() => {
      // forced logout: hide VIP content and go back to live events
      setSportsPlayer((prev) => (prev?.context === "vip" ? null : prev));
      setView("home");
      setQuery(clearViewParams, { view: "home" });
    }, []),
  );

  /* ------------------------- navigation / views ------------------------- */
  const activateView = useCallback(
    (next: ViewName) => {
      setView(next);
      if (next === "sports") void data.loadSportsChannels();
      if (next === "highlights") highlights.ensureLoaded();
    },
    [data, highlights],
  );

  const showLiveEvents = useCallback(() => {
    setQuery(clearViewParams, { view: "home" });
    setSelectedMatch(null);
    activateView("home");
  }, [activateView]);

  const openSportsChannels = useCallback(() => {
    setQuery((p) => {
      clearViewParams(p);
      p.set(VIEW_PARAMS.sports, "true");
    }, { view: "sports-channel" });
    activateView("sports");
  }, [activateView]);

  const openVipChannels = useCallback((force?: boolean) => {
    if (!force && !vip.session) {
      vip.openLogin();
      return;
    }
    vip.closeLogin();
    setQuery((p) => {
      clearViewParams(p);
      p.set(VIEW_PARAMS.vip, "true");
    }, { view: "vip-channel" });
    activateView("vip");
  }, [vip, activateView]);


  const openHighlightsView = useCallback(() => {
    setQuery((p) => {
      clearViewParams(p);
      p.set(VIEW_PARAMS.highlights, "true");
    }, { view: "highlights" });
    activateView("highlights");
  }, [activateView]);

  /* ------------------------------ filters ------------------------------- */
  const filterMatch = useCallback((status: StatusFilter) => {
    setStatusFilter(status);
    if (status === "all") setLeagueFilter("all");
  }, []);

  const filterByLeague = useCallback((league: string) => {
    setLeagueFilter(decodeURIComponent(league));
    setSidebarOpen(false);
  }, []);

  const filterBySubcategory = useCallback(
    (cat: string, league: string) => {
      setSidebarOpen(false);
      const found = data.matches.find((m) => {
        const mCat = m.cat || m.title || "";
        const mLeague = m.eventInfo.eventName || "";
        return mCat === cat && mLeague === league;
      });
      if (found) setStatusFilter(getStatus(found, Date.now()));
      setLeagueFilter(cat);
      setTimeout(() => {
        document
          .getElementById("match-list-container")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 60);
    },
    [data.matches],
  );

  /* --------------------------- match center ----------------------------- */
  const openMatch = useCallback((match: Match) => {
    setSelectedMatch(match);
    setQuery((p) => p.set("match", encodeURIComponent(matchSlug(match))), {
      matchSlug: matchSlug(match),
    });
  }, []);

  const goHome = useCallback(() => {
    setSelectedMatch(null);
    setQuery((p) => p.delete("match"), { view: "home" });
  }, []);

  /* ------------------------- match stream player ------------------------ */
  const playIframe = useCallback((encoded: string, name: string) => {
    triggerAdIfNeeded();
    setPlayerStream({ html: decodeStream(encoded), name });
  }, []);

  const closePlayer = useCallback(() => setPlayerStream(null), []);

  /* ------------------------- sports/vip player -------------------------- */
  const openLinks = useCallback((ch: SportsChannel) => setLinkModalChannel(ch), []);
  const closeLinks = useCallback(() => setLinkModalChannel(null), []);

  const playSportsChannel = useCallback(
    (ch: SportsChannel, linkIdx: number) => {
      const link = ch.stream_links[linkIdx];
      if (!link) return;
      setLinkModalChannel(null);
      setSportsPlayer((prev) => {
        // already playing this exact stream: do not reload the player
        if (prev && prev.context === "sports" && prev.iframeHtml === link.link) return prev;
        triggerAdIfNeeded();
        return {
          iframeHtml: link.link,
          title: `NOW PLAYING: ${ch.name} (${link.name})`,
          links: ch.stream_links,
          activeLinkIdx: linkIdx,
          context: "sports",
        };
      });
      window.scrollTo(0, 0);
    },
    [],
  );

  const switchPlayerLink = useCallback((idx: number) => {
    setSportsPlayer((prev) => {
      if (!prev || !prev.links[idx] || prev.activeLinkIdx === idx) return prev;
      triggerAdIfNeeded();
      return {
        ...prev,
        activeLinkIdx: idx,
        iframeHtml: prev.links[idx]!.link,
        title: prev.title.replace(/\(.*\)$/, `(${prev.links[idx]!.name})`),
      };
    });
  }, []);

  const playVipChannel = useCallback((ch: VipChannel) => {
    const chName = ch.Name || ch.name || "VIP Channel";
    const iframeLink = ch.Stream_url || ch.Stream_link || ch.link || "";
    if (!iframeLink) {
      alert("Stream currently unavailable for " + chName);
      return;
    }
    setSportsPlayer((prev) => {
      if (prev && prev.context === "vip" && prev.iframeHtml === iframeLink) return prev;
      triggerAdIfNeeded();
      return {
        iframeHtml: iframeLink,
        title: `NOW PLAYING: ${chName} (VIP)`,
        links: [],
        activeLinkIdx: 0,
        context: "vip",
      };
    });
    window.scrollTo(0, 0);
  }, []);

  const closeSportsPlayer = useCallback(() => setSportsPlayer(null), []);

  /* ---------------------------- highlights ------------------------------ */
  const openHighlight = useCallback((m: HighlightMatch) => {
    triggerAdIfNeeded();
    const homeName = m.events_info?.home_team?.name || "Home";
    const awayName = m.events_info?.away_team?.name || "Away";
    const hlSlug = `${homeName}-vs-${awayName}`.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
    setActiveHighlight(m);
    setQuery((p) => p.set("highlights", hlSlug), { hlSlug });
  }, []);

  const closeHighlight = useCallback(() => {
    setActiveHighlight(null);
    setQuery((p) => p.delete("highlights"), { view: "highlights" });
  }, []);

  /* --------------------- body class for match view ---------------------- */
  useEffect(() => {
    document.body.classList.toggle("view-match", Boolean(selectedMatch));
  }, [selectedMatch]);

  /* ------------------- initial URL query param handling ----------------- */
  const [bootstrapped, setBootstrapped] = useState(false);
  useEffect(() => {
    if (!data.ready || bootstrapped) return;
    setBootstrapped(true);
    const params = new URLSearchParams(window.location.search);
    const matchParam = params.get("match");
    if (matchParam) {
      const found = data.matches.find(
        (m) => matchSlug(m) === decodeURIComponent(matchParam),
      );
      if (found) setSelectedMatch(found);
      return;
    }
    if (params.has("sports-channel")) activateView("sports");
    else if (params.has("vip-channel")) {
      if (vip.session) activateView("vip");
      else vip.openLogin();
    } else if (params.has("highlights")) activateView("highlights");
  }, [data.ready, data.matches, bootstrapped, activateView, vip]);

  /* --------------------------- popstate routing ------------------------- */
  useEffect(() => {
    const onPop = () => {
      if (playerStream) setPlayerStream(null);
      if (activeHighlight) setActiveHighlight(null);
      if (vip.loginOpen) vip.closeLogin();
      if (sportsPlayer) setSportsPlayer(null);

      const params = new URLSearchParams(window.location.search);
      const matchParam = params.get("match");
      if (matchParam) {
        const found = data.matches.find(
          (m) => matchSlug(m) === decodeURIComponent(matchParam),
        );
        if (found) setSelectedMatch(found);
        return;
      }
      setSelectedMatch(null);
      if (params.has("sports-channel")) activateView("sports");
      else if (params.has("vip-channel")) {
        if (vip.session) activateView("vip");
        else vip.openLogin();
      } else if (params.has("highlights")) activateView("highlights");
      else activateView("home");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [playerStream, activeHighlight, sportsPlayer, vip, data.matches, activateView]);

  /* ------------------------- derived match list ------------------------- */
  const visibleMatches = useMemo(() => {
    const filtered = data.matches.filter((match) => {
      const status = getStatus(match, now);
      if (statusFilter !== "all" && statusFilter !== status) return false;
      if (statusFilter === "all" && status === "recent") return false;
      const matchTitle = match.cat || match.title || "";
      if (leagueFilter !== "all" && matchTitle !== leagueFilter) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      const startA = new Date(a.eventInfo.startTime).getTime();
      const endA = a.eventInfo.endTime
        ? new Date(a.eventInfo.endTime).getTime()
        : startA + 7200000;
      const isLiveA = now >= startA && now <= endA;

      const startB = new Date(b.eventInfo.startTime).getTime();
      const endB = b.eventInfo.endTime
        ? new Date(b.eventInfo.endTime).getTime()
        : startB + 7200000;
      const isLiveB = now >= startB && now <= endB;

      const isHotA = String(a.eventInfo.isHot) === "1";
      const isHotB = String(b.eventInfo.isHot) === "1";

      if (isLiveA && isLiveB) {
        if (isHotA && !isHotB) return -1;
        if (!isHotA && isHotB) return 1;
        return startA - startB;
      }
      if (isLiveA && !isLiveB) return -1;
      if (!isLiveA && isLiveB) return 1;
      return startA - startB;
    });
  }, [data.matches, statusFilter, leagueFilter, now]);

  return {
    now,
    ...theme,
    ...data,
    highlights,
    vip,
    view,
    statusFilter,
    leagueFilter,
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar: () => setSidebarOpen((v) => !v),
    infoPage,
    openInfo: setInfoPage,
    closeInfo: () => setInfoPage(null),
    visibleMatches,
    selectedMatch,
    openMatch,
    goHome,
    playerStream,
    playIframe,
    closePlayer,
    linkModalChannel,
    openLinks,
    closeLinks,
    sportsPlayer,
    playSportsChannel,
    switchPlayerLink,
    playVipChannel,
    closeSportsPlayer,
    activeHighlight,
    openHighlight,
    closeHighlight,
    showLiveEvents,
    openSportsChannels,
    openVipChannels,
    openHighlightsView,
    filterMatch,
    filterByLeague,
    filterBySubcategory,
  };
}

export type GoalzenStore = ReturnType<typeof useGoalzenStore>;

const StoreContext = createContext<GoalzenStore | null>(null);

export function GoalzenProvider({ children }: { children: ReactNode }) {
  const store = useGoalzenStore();
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): GoalzenStore {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <GoalzenProvider>");
  return ctx;
}
