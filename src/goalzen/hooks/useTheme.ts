import { useEffect, useState } from "react";
import { THEME_KEY } from "../lib/constants";

/** Light/Dark theme toggle with LocalStorage persistence (1:1 with toggleTheme) */
export function useTheme() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(THEME_KEY) === "light") setLight(true);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("light-mode", light);
    localStorage.setItem(THEME_KEY, light ? "light" : "dark");
  }, [light]);

  return { light, toggleTheme: () => setLight((v) => !v) };
}
