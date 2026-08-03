import { useCallback, useEffect, useRef, useState } from "react";
import { AUTH_TOKEN_QS, LOGIN_API, SESSION_KEY } from "../lib/constants";
import type { VipSession } from "../types";

/* Plain keys kept in sync with the REST Login API contract. */
const USER_KEY = "username";
const TOKEN_KEY = "session_token";

function readStoredSession(): VipSession | null {
  try {
    const saved =
      localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (saved) return JSON.parse(saved) as VipSession;

    const username = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (username && token) return { username, token, remember: true };
    return null;
  } catch {
    return null;
  }
}

function persistSession(next: VipSession) {
  const str = JSON.stringify(next);
  if (next.remember) localStorage.setItem(SESSION_KEY, str);
  else sessionStorage.setItem(SESSION_KEY, str);
  // Flat keys so the login API contract (username + session_token) is honoured.
  localStorage.setItem(USER_KEY, next.username);
  if (next.token) localStorage.setItem(TOKEN_KEY, next.token);
}

function clearStoredSession() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * VIP authentication + session persistence + background auto-verification.
 *
 * On mount the stored username/session_token pair is verified against
 * https://login.goalzen.site/verify/user/USERNAME?token=SESSION_TOKEN
 * If the response status is not "valid" the session is destroyed, VIP content
 * is hidden and the login modal is opened.
 */
export function useVipSession(onForcedLogout: () => void) {
  const [session, setSession] = useState<VipSession | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const verified = useRef(false);

  const openLogin = useCallback(() => {
    setError("");
    setLoginOpen(true);
  }, []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  const forceLogout = useCallback(() => {
    clearStoredSession();
    setSession(null);
    onForcedLogout();
    setError("Your session has expired. Please sign in again.");
    setLoginOpen(true);
  }, [onForcedLogout]);

  /* --- session restore + background verification ------------------------ */
  useEffect(() => {
    const stored = readStoredSession();
    if (!stored) return;
    setSession(stored);
    if (verified.current) return;
    verified.current = true;

    const verify = async () => {
      const url = `${LOGIN_API}/verify/user/${encodeURIComponent(
        stored.username,
      )}?token=${encodeURIComponent(stored.token || "")}&${AUTH_TOKEN_QS}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        const status = String(data?.status || "").toLowerCase();
        if (status === "valid" || status === "success") return; // keep logged in
        forceLogout();
      } catch {
        /* network failure: keep the local session, retry on next load */
      }
    };
    void verify();
  }, [forceLogout]);

  const login = useCallback(
    async (username: string, password: string, remember: boolean) => {
      setError("");
      const user = username.trim();
      const pass = password.trim();
      if (!user || !pass) {
        setError("Please enter your username and password.");
        return false;
      }

      setSession(null);
      clearStoredSession();
      setBusy(true);

      const url = `${LOGIN_API}/login/user/${encodeURIComponent(
        user,
      )}?password=${encodeURIComponent(pass)}&${AUTH_TOKEN_QS}`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        setBusy(false);

        const status = String(data?.status || "").toLowerCase();
        if (status === "success") {
          const next: VipSession = {
            username: user,
            token: String(data?.session_token || data?.token || ""),
            remember,
          };
          persistSession(next);
          setSession(next);
          setLoginOpen(false);
          return true;
        }
        if (status === "blocked") {
          setError("You are already active on another device!");
        } else {
          setError("Invalid username or password!");
        }
        return false;
      } catch {
        setBusy(false);
        setError("Connection error. Please try again.");
        return false;
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    if (!session?.username) return;
    const url = `${LOGIN_API}/logout/user/${encodeURIComponent(
      session.username,
    )}?${AUTH_TOKEN_QS}`;
    try {
      await fetch(url);
    } catch {
      /* ignore network errors on logout */
    }
    clearStoredSession();
    setSession(null);
    onForcedLogout();
    setError("");
    setLoginOpen(true);
  }, [session, onForcedLogout]);

  return {
    session,
    loginOpen,
    openLogin,
    closeLogin,
    login,
    logout,
    error,
    busy,
  };
}
