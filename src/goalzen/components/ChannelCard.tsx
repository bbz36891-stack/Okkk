import { memo, useEffect, useRef, useState, type MouseEvent } from "react";
import { FALLBACK_LOGO } from "../lib/constants";
import { onImgFallback, safeUrl } from "../lib/utils";

interface Props {
  name: string;
  logo?: string | undefined;
  onClick: () => void;
}

/** Square channel card with the original marquee-on-overflow name behaviour. */
function ChannelCardBase({ name, logo, onClick }: Props) {
  const nameRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      const nEl = nameRef.current;
      const wEl = wrapRef.current;
      if (nEl && wEl && nEl.scrollWidth > wEl.clientWidth) setScrolling(true);
    }, 100);
    return () => clearTimeout(id);
  }, [name]);

  /* Explicit user click only: stop bubbling so parent containers/overlays
     cannot re-trigger the same stream selection. */
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <div className="cat-card-square" onClick={handleClick} role="button" tabIndex={-1}>
      <div className="cat-icon-circle">
        <img
          referrerPolicy="no-referrer"
          src={logo && logo.length > 0 ? safeUrl(logo) : FALLBACK_LOGO}
          className="cat-img-sq"
          alt={name}
          onError={onImgFallback}
          draggable={false}
        />
      </div>
      <div className="channel-name-wrapper" ref={wrapRef}>
        <div
          className={`cat-name-sq${scrolling ? " scrolling-text-channel" : ""}`}
          ref={nameRef}
        >
          {name}
        </div>
      </div>
    </div>
  );
}

export const ChannelCard = memo(ChannelCardBase);
