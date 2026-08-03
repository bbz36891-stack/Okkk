import { useEffect, useState } from "react";

/** Real-time countdown ticker: replaces setInterval(updateAllTimers, 1000) */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

/** Animated fake viewer counter (1:1 with startFakeWatching) */
export function useFakeWatching(active: boolean) {
  const [value, setValue] = useState(2458);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setValue(Math.floor(Math.random() * (3000 - 2000 + 1)) + 2000);
    }, 3000);
    return () => clearInterval(id);
  }, [active]);
  return value.toLocaleString();
}
