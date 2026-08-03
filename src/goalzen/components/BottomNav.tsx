import { useStore } from "../store";

export function BottomNav() {
  const { showLiveEvents, openSportsChannels, openVipChannels, openHighlightsView } =
    useStore();
  return (
    <div className="fixed-bottom-nav">
      <div className="bn-item" onClick={showLiveEvents}>
        <i className="fa-solid fa-calendar-day" /> LIVE EVENTS
      </div>
      <div className="bn-item" onClick={openSportsChannels}>
        <i className="fa-solid fa-tv" /> SPORTS CHANNEL
      </div>
      <div className="bn-item" onClick={() => openVipChannels()}>
        <i className="fa-solid fa-crown" /> VIP CHANNELS
      </div>
      <div className="bn-item" onClick={openHighlightsView}>
        <i className="fa-solid fa-film" style={{ color: "#00f0ff" }} /> HIGHLIGHTS
      </div>
    </div>
  );
}
