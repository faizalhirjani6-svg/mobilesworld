import { useEffect, useState } from "react";
import { signalIntroComplete } from "@/components/site";

export function LogoSlamIntro() {
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const skip = () => { setPlaying(false); signalIntroComplete(); };
    if (motion.matches) { skip(); return; }
    try {
      if (sessionStorage.getItem("mw-logo-slam-played") === "1") { skip(); return; }
      sessionStorage.setItem("mw-logo-slam-played", "1");
    } catch { /* The opening also works without browser storage. */ }
    setPlaying(true);
    const visibility = () => setPaused(document.hidden);
    const preference = () => { if (motion.matches) skip(); };
    visibility();
    document.addEventListener("visibilitychange", visibility);
    motion.addEventListener("change", preference);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      motion.removeEventListener("change", preference);
    };
  }, []);

  useEffect(() => {
    if (!fading) return;
    const timer = window.setTimeout(() => {
      setPlaying(false);
      signalIntroComplete();
    }, 600);
    return () => window.clearTimeout(timer);
  }, [fading]);

  if (!playing) return null;
  return (
    <div className={`logo-slam-intro${fading ? " is-fading" : ""}${paused ? " is-paused" : ""}`} aria-hidden="true">
      <div className="logo-slam-stage">
        <div className="logo-impact-ring" />
        <div className="logo-impact-flash" />
        <div className="logo-slam-mark" onAnimationEnd={(event) => {
          if (event.target === event.currentTarget) setFading(true);
        }}>
          <svg className="logo-slam-emblem" viewBox="0 0 120 100" fill="none">
            <path d="M12 78V22L36 51L60 22V78M60 22L72 78L84 49L96 78L108 22" stroke="currentColor" strokeWidth="9" strokeLinejoin="miter" />
          </svg>
          <span className="logo-slam-mobile">MOBILE</span>
          <span className="logo-slam-world">WORLD</span>
        </div>
      </div>
    </div>
  );
}