import { useStore } from "../store";

export function Footer() {
  const { openInfo } = useStore();
  return (
    <div className="main-footer-fusion">
      <div style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: "0.5px" }}>
        © 2026 Goalzen | All Rights Reserved
      </div>
      <div className="mf-menu-links">
        <span onClick={() => openInfo("about")}>About</span>
        <span onClick={() => openInfo("disclaimer")}>Disclaimer</span>
        <span onClick={() => openInfo("contact")}>Contact</span>
        <span onClick={() => openInfo("dmca")}>DMCA Policy</span>
      </div>
    </div>
  );
}
