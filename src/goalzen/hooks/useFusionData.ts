import { useCallback, useEffect, useRef, useState } from "react";
import { API_URL } from "../lib/constants";
import { setAdsControl } from "../lib/utils";
import type { FusionResponse, Match, SportsChannel, VipChannel } from "../types";

/** Fetches FUSION.json: matches, banners, VIP channels and ad control. */
export function useFusionData() {
  const [matches, setMatches] = useState<Match[]>([]);
  // Banners come exclusively from FUSION.json (data.Banners); no hardcoded URLs.
  const [banners, setBanners] = useState<string[]>([]);

  const [vipList, setVipList] = useState<VipChannel[]>([]);
  const [ready, setReady] = useState(false);

  const [sportsChannels, setSportsChannels] = useState<SportsChannel[]>([]);
  const [sportsLoading, setSportsLoading] = useState(false);
  const [sportsError, setSportsError] = useState("");
  const sportsLoaded = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(API_URL);
        const data = (await res.json()) as FusionResponse;
        if (cancelled) return;

        if (data?.Ads_control) setAdsControl(data.Ads_control);
        setBanners(Array.isArray(data?.Banners) ? data.Banners.filter(Boolean) : []);
        if (data?.VIP_channel) setVipList(data.VIP_channel);

        const events = [...(data?.sports_live?.events || [])];
        events.sort(
          (a, b) =>
            new Date(a.eventInfo.startTime).getTime() -
            new Date(b.eventInfo.startTime).getTime(),
        );
        setMatches(events);
        setReady(true);
      } catch {
        console.log("API Error");
        setReady(true);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  /** Lazy loads the Sports Channels list on first visit (loadSportsChannels) */
  const loadSportsChannels = useCallback(async () => {
    if (sportsLoaded.current) return;
    sportsLoaded.current = true;
    setSportsLoading(true);
    setSportsError("");
    try {
      const res = await fetch(API_URL);
      const data = (await res.json()) as FusionResponse;
      const list: SportsChannel[] = [];
      data?.SPORTS?.categories?.forEach((cat) => {
        list.push(...(cat.channels_data || []));
      });
      setSportsChannels(list);
      setSportsLoading(false);
    } catch {
      setSportsLoading(false);
      setSportsError("FAILED TO FETCH SPORTS CHANNELS!");
      sportsLoaded.current = false;
    }
  }, []);

  return {
    matches,
    banners,
    vipList,
    ready,
    sportsChannels,
    sportsLoading,
    sportsError,
    loadSportsChannels,
  };
}
