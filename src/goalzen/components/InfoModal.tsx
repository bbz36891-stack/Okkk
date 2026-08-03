import { useStore } from "../store";
import { pageContent } from "../lib/constants";

export function InfoModal() {
  const { infoPage, closeInfo } = useStore();
  return (
    <div
      id="info-modal"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.95)",
        zIndex: 5000,
        display: infoPage ? "flex" : "none",
        justifyContent: "center",
        alignItems: "flex-end",
      }}
    >
      <div
        style={{
          background: "#1a1a1a",
          width: "100%",
          maxWidth: 600,
          height: "85%",
          borderRadius: "20px 20px 0 0",
          display: "flex",
          flexDirection: "column",
          borderTop: "1px solid #333",
        }}
      >
        <div
          style={{
            padding: 20,
            borderBottom: "1px solid #333",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{ fontWeight: 800, color: "#fff", textTransform: "uppercase" }}
            id="im-title-text"
          >
            {infoPage ? infoPage.toUpperCase() : "Title"}
          </div>
          <div
            style={{ color: "#ff4757", cursor: "pointer", fontSize: 24 }}
            onClick={closeInfo}
          >
            <i className="fa-solid fa-times" />
          </div>
        </div>
        <div
          style={{
            padding: 25,
            overflowY: "auto",
            color: "#ccc",
            fontSize: 14,
            lineHeight: 1.7,
          }}
          id="im-body-content"
          dangerouslySetInnerHTML={{
            __html: infoPage ? pageContent[infoPage] : "No content.",
          }}
        />
      </div>
    </div>
  );
}
