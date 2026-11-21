import { useEffect, useLayoutEffect, useState } from "react";
import { signalIntroComplete } from "@/components/site";

export const LOGO_SLAM_KEY = "mw-logo-slam-played";
const SLAM_DURATION = 3600;
const FADE_DURATION = 500;

type Phase = "cover" | "playing" | "fading" | "done";

export function LogoSlamIntro() {
  // Start as a static cover so the server-rendered page never flashes before the slam.
  const [phase, setPhase] = useState<Phase>("cover");
  const [paused, setPaused] = useState(false);

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(LOGO_SLAM_KEY) === "1";
      if (!seen && !reduced) sessionStorage.setItem(LOGO_SLAM_KEY, "1");
    } catch { /* The opening also works without browser storage. */ }
    if (seen || reduced) {
      setPhase("done");
      signalIntroComplete();
      return;
    }
    setPhase("playing");
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Some embedded preview browsers suppress animation events, so end on schedule too.
    const fallback = window.setTimeout(() => setPhase("fading"), SLAM_DURATION + 300);
    const visibility = () => setPaused(document.hidden);
    const preference = () => { if (motion.matches) setPhase("fading"); };
    visibility();
    document.addEventListener("visibilitychange", visibility);
    motion.addEventListener?.("change", preference);
    return () => {
      window.clearTimeout(fallback);
      document.removeEventListener("visibilitychange", visibility);
      motion.removeEventListener?.("change", preference);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "fading") return;
    const timer = window.setTimeout(() => {
      setPhase("done");
      signalIntroComplete();
    }, FADE_DURATION);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (phase === "done") return null;
  return (
    <div className={`logo-slam-intro is-${phase}${paused ? " is-paused" : ""}`} aria-hidden="true">
      <div className="logo-slam-stage">
        <div className="logo-impact-ring" />
        <div className="logo-impact-ring logo-impact-ring-secondary" />
        <svg className="logo-impact-fractures" viewBox="0 0 800 600" fill="none">
          <g stroke="currentColor" strokeWidth="1.5">
            <path d="M295 245L230 208L208 155L127 118L76 48M230 208L162 214L112 187M208 155L222 105" />
            <path d="M509 245L558 189L619 166L650 95L737 51M619 166L693 181L762 148M650 95L629 55" />
            <path d="M290 365L246 418L172 442L140 516L63 552M172 442L95 425M246 418L260 486" />
            <path d="M506 365L552 416L626 438L672 515L747 540M626 438L693 414L755 430M552 416L537 472" />
          </g>
        </svg>
        <div className="logo-impact-flash" />
        <div className="logo-slam-mark" onAnimationEnd={(event) => {
          if (event.target === event.currentTarget && phase === "playing") setPhase("fading");
        }}>
          <div className="logo-slam-badge">
            <svg className="logo-slam-emblem" viewBox="0 0 180 180" fill="none">
              <path className="logo-emblem-frame" d="M113 12H142L168 38V142L142 168H38L12 142V38L38 12H67" strokeWidth="2" />
              <path className="logo-emblem-inset" d="M43 22H63M158 43V67M117 158H137M22 113V137" strokeWidth="3" />
              <path className="logo-emblem-depth" d="M39 115V58H51L74 86L97 58H109V115H95V82L74 107L53 82V115ZM87 128L69 72H84L95 107L107 85L119 107L130 72H145L127 128H114L107 114L100 128Z" />
              <path className="logo-emblem-m" d="M35 110V53H47L70 81L93 53H105V110H91V77L70 102L49 77V110Z" />
              <path className="logo-emblem-w" d="M83 123L65 67H80L91 102L103 80L115 102L126 67H141L123 123H110L103 109L96 123Z" />
              <path className="logo-emblem-detail" d="M57 139H123M79 13L90 24L101 13" strokeWidth="2" />
            </svg>
            <div className="logo-emblem-sheen" />
          </div>
          <span className="logo-slam-mobile">MOBILE</span>
          <span className="logo-slam-world">WORLD</span>
        </div>
      </div>
    </div>
  );
}
