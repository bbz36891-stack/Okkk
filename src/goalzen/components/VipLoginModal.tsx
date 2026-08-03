import { useState } from "react";
import { useStore } from "../store";

/** VIP authentication modal with password eye-toggle and remember-me. */
export function VipLoginModal() {
  const { vip, openVipChannels } = useStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const submit = async () => {
    const ok = await vip.login(username, password, remember);
    if (ok) {
      setPassword("");
      vip.closeLogin();
      openVipChannels(true);
    }
  };

  return (
    <div id="vip-login-modal" className={vip.loginOpen ? "active" : undefined}>
      <div className="cyber-login-card">
        <div
          style={{
            position: "absolute",
            top: 15,
            right: 15,
            cursor: "pointer",
            color: "#38bdf8",
            fontSize: 20,
          }}
          onClick={vip.closeLogin}
        >
          <i className="fa-solid fa-times" />
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 900,
            color: "#00d2ff",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 20,
            textShadow: "0 0 10px rgba(0,210,255,0.4)",
          }}
        >
          SIGN IN TO PORTAL
        </div>

        <div
          id="vip-login-error"
          style={{
            display: vip.error ? "block" : "none",
            background: "rgba(239, 68, 68, 0.2)",
            border: "1px solid #ef4444",
            color: "#f87171",
            fontSize: 12,
            fontWeight: 700,
            padding: 10,
            borderRadius: 8,
            marginBottom: 15,
          }}
        >
          {vip.error}
        </div>

        <div className="cyber-input-wrap">
          <input
            type="text"
            id="vip-username-input"
            className="cyber-input"
            placeholder="Username"
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="cyber-input-wrap">
          <input
            type={showPwd ? "text" : "password"}
            id="vip-password-input"
            className="cyber-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void submit();
            }}
          />
          <i
            id="vip-pwd-toggle"
            className={`fa-solid ${showPwd ? "fa-eye-slash" : "fa-eye"} pwd-toggle-icon`}
            onClick={() => setShowPwd((v) => !v)}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 22,
            fontSize: 12,
            color: "#94a3b8",
          }}
        >
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input
              type="checkbox"
              id="vip-remember-chk"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{ accentColor: "#00d2ff", width: 15, height: 15 }}
            />
            <span>Remember me</span>
          </label>
        </div>

        <button
          id="vip-login-submit-btn"
          className="cyber-login-btn"
          disabled={vip.busy}
          onClick={() => void submit()}
        >
          {vip.busy ? "SIGNING IN..." : "Log In"}
        </button>
      </div>
    </div>
  );
}
