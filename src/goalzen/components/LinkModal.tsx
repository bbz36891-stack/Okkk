import { useStore } from "../store";

/** Multi-server link chooser modal for sports channels. */
export function LinkModal() {
  const { linkModalChannel, closeLinks, playSportsChannel } = useStore();

  return (
    <div
      id="sports-modal"
      style={{ display: linkModalChannel ? "flex" : "none" }}
      onClick={closeLinks}
    >
      <div className="m-box" onClick={(e) => e.stopPropagation()}>
        <div className="m-title">Select Link Server</div>
        <div id="links-list">
          {linkModalChannel?.stream_links.map((l, i) => (
            <div
              className="link-opt"
              key={`${l.name}-${i}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                playSportsChannel(linkModalChannel, i);
              }}
            >
              {l.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
