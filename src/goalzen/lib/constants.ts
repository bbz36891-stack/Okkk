export const API_URL =
  "https://goalzen-api.bbz36891.workers.dev/developer&TG=Ivan-FluX/api=vsp_matches&ivan-flux007";

export const HIGHLIGHTS_API = "https://highlights.bbz36891.workers.dev/api/videos/latest";

export const LOGIN_API = "https://login.goalzen.site";

export const LOGO_PROXY = "https://api-logo.goalzen.site/proxy/logo?url=";

export const HLS_PLAYER = "https://ayvspop.github.io/HLS-PLAYER/?play=";

export const AUTH_TOKEN_QS = "ivan-flux-0077";

export const FALLBACK_LOGO = "https://i.ibb.co/1Yh8PdLH/1000459066.jpg";


export const SESSION_KEY = "fusion_vip_session";
export const THEME_KEY = "fusion_theme";
export const POPUP_KEY = "fusion_popup_day";

export const CATEGORY_LOGOS: Record<string, string> = {
  baseball: "https://sportzfy.io/wp-content/uploads/2025/09/baseball.png",
  tennis: "https://sportzfy.io/wp-content/uploads/2025/09/tennis-1.png",
  rugby: "https://sportzfy.io/wp-content/uploads/2025/09/rugby-1.png",
  ufc: "https://access-control-center-prod.freevision.live/ss/tournament/19906.png",
  wwe: "https://static.wikia.nocookie.net/wweuniverse/images/f/f6/Wwelogo.png/revision/latest?cb=2010124080717",
  "ice hockey": "https://img.sofascore.com/api/v1/unique-tournament/234/image/dark",
  "aussie rules": "https://img.sofascore.com/api/v1/unique-tournament/10159/image/dark",
  "american football": "https://img.sofascore.com/api/v1/unique-tournament/11208/image/dark",
  darts: "https://img.sofascore.com/api/v1/unique-tournament/751/image",
  hockey:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbUpFzmV1xntBHleRGBqwy4yTi3jyHjpQLFpqEpMmQy8H",
  golf: "https://q.golf/cdn/shop/products/face_2048x2048.jpg?v=1672959337",
  "mixed martial arts": "https://img.sofascore.com/api/v1/unique-tournament/19906/image/dark",
  netball:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSygpTxyPIX3ZKsVpFaDLL3iPDscve1yvyJaQ&usqp=CAU",
  handball: "https://img.sofascore.com/api/v1/unique-tournament/165/image/dark",
  pubg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWlfyZJmW1CGrTei2WUk_9LuuUoIX_gtTl8n46",
  curling:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThc791AAUwOye7zJ8nR2xVjffl9FxAAtu-jl4nw4Bqs",
  olympic: "https://pbs.twimg.com/profile_images/142876856631791877/Mrn33c1m_400x400.jpg",
  "highlights matches":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVZoFCV_0eqL25eSsD04k3hsDb2",
  highlights: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVZoFCV_0eqL25eSsD04k3hsDb2",
  football: "https://apkfolder.io/wp-content/uploads/2026/01/football-1.png",
  cricket: "https://i.ibb.co/spwHz5x9/cricket-wicket.webp",
  boxing: "https://sportzfy.io/wp-content/uploads/2025/09/boxing-gloves-1-1.png",
  basketball: "https://sportzfy.io/wp-content/uploads/2025/09/basketball.png",
  motorsport: "https://cdn-icons-png.flaticon.com/512/2418/2418779.png",
};

export type InfoPage = "about" | "disclaimer" | "contact" | "dmca" | "privacy";

export const pageContent: Record<InfoPage, string> = {
  about: `<h3>About Goalzen</h3><p>Welcome to Goalzen (goalzen.site). We are a premier sports directory platform providing real-time live scores, match schedules, and indexing publicly available third-party live streaming links for Football, Cricket, IPL, and major leagues worldwide. We do not host, upload, or broadcast any media files or video content on our servers. Our sole mission is to make it easy for global sports enthusiasts to find and follow their favorite matches in one organized place.</p>`,
  disclaimer: `<h3>Disclaimer</h3><p>All streams, videos, and match links displayed on Goalzen (goalzen.site) are hosted and provided by external third-party servers over which we have no control. Goalzen does not host, upload, record, or transmit any copyrighted media files, live streams, or video content on its servers. Accessing external links and third-party advertisements is done strictly at the user's own risk. Goalzen is not responsible for any legal compliance, damages, or content on external websites.</p>`,
  contact: `<h3>Contact Us</h3><p>Email: Contactgoalzen@gmail.com<br>Telegram: @Goalzen</p>`,
  dmca: `<h3>DMCA</h3><p>Goalzen (goalzen.site) respects all intellectual property and copyright laws. Since we only index links and do not host any media files or streams on our servers, we cannot permanently delete files from the web. To permanently remove copyrighted material, please contact the actual file-hosting server directly. However, if you are a copyright owner and wish to remove any indexed link from our directory, please email us at Contactgoalzen@gmail.com with proof of ownership. We will remove the links within 48 to 72 hours of verification.</p>`,
  privacy: `<h3>Privacy Policy</h3><p>Your privacy is highly important to us. Goalzen (goalzen.site) does not collect, store, or share personally identifiable information (such as names or emails) unless voluntarily provided by you. We use cookies and third-party services like Google Analytics to collect anonymous, non-personal data (such as browser type and traffic patterns) to optimize website performance. Our third-party advertising networks may also use cookies to deliver personalized advertisements based on your web activity.</p>`,
};
