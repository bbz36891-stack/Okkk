import { useStore } from "../store";
import { Logo } from "./Logo";

export function Header() {
  const { toggleSidebar, toggleTheme, light } = useStore();
  return (
    <div className="header-container">
      <div className="icon-box" onClick={toggleSidebar}>
        <i className="fa-solid fa-bars" />
      </div>
      <Logo />
      <div className="icon-box" onClick={toggleTheme}>
        <i className={light ? "fa-solid fa-sun" : "fa-solid fa-moon"} id="theme-icon" />
      </div>
    </div>
  );
}
