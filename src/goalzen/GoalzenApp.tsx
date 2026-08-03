import { useStore } from "./store";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { PosterCarousel } from "./components/PosterCarousel";
import { FilterTabs } from "./components/FilterTabs";
import { MatchList } from "./components/MatchList";
import { MatchCenter } from "./components/MatchCenter";
import { PlayerModal } from "./components/PlayerModal";
import { SportsChannelView } from "./components/SportsChannelView";
import { VipChannelView } from "./components/VipChannelView";
import { HighlightsView } from "./components/HighlightsView";
import { LinkModal } from "./components/LinkModal";
import { SportsPlayerPage } from "./components/SportsPlayerPage";
import { HighlightModal } from "./components/HighlightModal";
import { VipLoginModal } from "./components/VipLoginModal";
import { InfoModal } from "./components/InfoModal";
import { BottomNav } from "./components/BottomNav";
import { BackToTop } from "./components/BackToTop";
import { Footer } from "./components/Footer";

export function GoalzenApp() {
  const { view, selectedMatch, banners, sportsPlayer } = useStore();

  const homeVisible = view === "home" && !selectedMatch;

  return (
    <>
      <Header />
      <Sidebar />

      <div id="main-page" style={{ display: selectedMatch ? "none" : "block" }}>
        <div className="container">
          <PosterCarousel images={banners} hidden={!homeVisible} />
          <FilterTabs hidden={!homeVisible} />
          <MatchList hidden={!homeVisible} />
          <SportsChannelView hidden={view !== "sports"} />
          <VipChannelView hidden={view !== "vip"} />
          <HighlightsView hidden={view !== "highlights"} />
        </div>
        <Footer />
      </div>

      <MatchCenter />
      <PlayerModal />
      <LinkModal />
      {sportsPlayer ? <SportsPlayerPage /> : null}
      <HighlightModal />
      <VipLoginModal />
      <InfoModal />
      <BottomNav />
      <BackToTop />
    </>
  );
}
