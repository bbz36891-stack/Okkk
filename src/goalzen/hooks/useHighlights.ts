import { useCallback, useRef, useState } from "react";
import { HIGHLIGHTS_API } from "../lib/constants";
import type { HighlightMatch } from "../types";

export type HlSearchMode = "team" | "competition" | null;

/** "Real Madrid" -> "real-madrid", "La Liga" -> "la-liga" */
export function toSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Paginated highlights fetching + direct API search (team / competition) */
export function useHighlights() {
  const [list, setList] = useState<HighlightMatch[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMode, setSearchMode] = useState<HlSearchMode>(null);
  const loaded = useRef(false);
  const reqId = useRef(0);

  const request = useCallback(async (url: string) => {
    const res = await fetch(url);
    const data = await res.json();
    return {
      matches: (data?.matches || []) as HighlightMatch[],
      hasMore: Boolean(data?.hasMore),
    };
  }, []);

  const fetchPage = useCallback(
    async (targetPage = 1) => {
      const id = ++reqId.current;
      setLoading(true);
      setError("");
      const pageParam = targetPage === 1 ? "main-page" : String(targetPage);
      const url = `${HIGHLIGHTS_API}?page=${pageParam}&owner=ivan-flux&local=en`;
      try {
        const data = await request(url);
        if (id !== reqId.current) return;
        setSearchMode(null);
        setList((prev) => (targetPage === 1 ? data.matches : [...prev, ...data.matches]));
        setHasMore(data.hasMore);
        setPage(targetPage);
        setLoading(false);
        loaded.current = true;
      } catch {
        if (id !== reqId.current) return;
        setLoading(false);
        setError("FAILED TO FETCH HIGHLIGHTS!");
      }
    },
    [request],
  );

  /** Searches the API directly: team first, then competition fallback. */
  const search = useCallback(
    async (term: string) => {
      const slug = toSlug(term);
      if (!slug) {
        setSearchTerm("");
        setSearchMode(null);
        void fetchPage(1);
        return;
      }
      const id = ++reqId.current;
      setSearchTerm(term);
      setLoading(true);
      setError("");
      try {
        let mode: HlSearchMode = "team";
        let data = await request(
          `${HIGHLIGHTS_API}?team=${encodeURIComponent(slug)}&owner=ivan-flux&local=en`,
        );
        if (data.matches.length === 0) {
          mode = "competition";
          data = await request(
            `${HIGHLIGHTS_API}?competition=${encodeURIComponent(slug)}&owner=ivan-flux&local=en`,
          );
        }
        if (id !== reqId.current) return;
        setSearchMode(mode);
        setList(data.matches);
        setHasMore(data.hasMore);
        setPage(1);
        setLoading(false);
        if (data.matches.length === 0) setError("NO RESULTS FOUND!");
      } catch {
        if (id !== reqId.current) return;
        setLoading(false);
        setError("FAILED TO FETCH HIGHLIGHTS!");
      }
    },
    [fetchPage, request],
  );

  /** Back to the main feed (?page=main-page) when the input is cleared. */
  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setSearchMode(null);
    void fetchPage(1);
  }, [fetchPage]);

  const ensureLoaded = useCallback(() => {
    if (!loaded.current) void fetchPage(1);
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    const next = page + 1;
    if (!searchMode) {
      void fetchPage(next);
      return;
    }
    const slug = toSlug(searchTerm);
    const key = searchMode === "team" ? "team" : "competition";
    const id = ++reqId.current;
    setLoading(true);
    try {
      const data = await request(
        `${HIGHLIGHTS_API}?${key}=${encodeURIComponent(slug)}&page=${next}&owner=ivan-flux&local=en`,
      );
      if (id !== reqId.current) return;
      setList((prev) => [...prev, ...data.matches]);
      setHasMore(data.hasMore);
      setPage(next);
      setLoading(false);
    } catch {
      if (id !== reqId.current) return;
      setLoading(false);
      setError("FAILED TO FETCH HIGHLIGHTS!");
    }
  }, [hasMore, loading, page, searchMode, searchTerm, fetchPage, request]);

  return {
    list,
    hasMore,
    loading,
    error,
    searchTerm,
    searchMode,
    search,
    clearSearch,
    ensureLoaded,
    loadMore,
  };
}
