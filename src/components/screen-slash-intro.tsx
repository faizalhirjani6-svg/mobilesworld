import { useEffect, useRef, useState } from "react";

export function ScreenSlashIntro({ src, poster }: { src: string; poster?: string }) {
  const [playing, setPlaying] = useState(false);
  const [fading, setFading] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const completed = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      if (sessionStorage.getItem("mw-screen-slash-played") === "1") return;
    } catch { /* Playback still works without browser storage. */ }
    setPlaying(true);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const onVisibility = () => {
      const clip = video.current;
      if (!clip || completed.current) return;
      if (document.hidden) clip.pause();
      else void clip.play().catch(() => setPlaying(false));
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [playing]);

  useEffect(() => {
    if (!fading) return;
    const timer = window.setTimeout(() => setPlaying(false), 450);
    return () => window.clearTimeout(timer);
  }, [fading]);

  const finish = () => {
    completed.current = true;
    try { sessionStorage.setItem("mw-screen-slash-played", "1"); } catch { /* Optional storage. */ }
    setFading(true);
  };

  if (!playing) return null;
  return (
    <div className={`screen-slash-intro${fading ? " is-fading" : ""}`} aria-hidden="true">
      <video
        ref={video}
        src={src}
        poster={poster}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={finish}
        onError={() => setPlaying(false)}
        onCanPlay={() => { void video.current?.play().catch(() => setPlaying(false)); }}
        className="h-full w-full object-contain"
      />
    </div>
  );
}