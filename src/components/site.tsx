import { Link } from "@tanstack/react-router";
import {
  Children,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
  type RefObject,
} from "react";

/* ---------- shared scroll-direction tracker ---------- */
let scrollDir: 1 | -1 = 1;
let lastY = 0;
let tracking = false;

function trackScroll() {
  if (tracking || typeof window === "undefined") return;
  tracking = true;
  lastY = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      const d = y - lastY;
      if (d > 2) {
        scrollDir = 1;
        lastY = y;
      } else if (d < -2) {
        scrollDir = -1;
        lastY = y;
      }
    },
    { passive: true },
  );
}

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ---------- glide hook: enters and exits on every crossing ---------- */
function useGlide(ref: RefObject<HTMLElement | null>, vertical: boolean, distance = 56) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) {
      el.classList.add("in");
      return;
    }
    trackScroll();

    const park = () => {
      if (!vertical || el.classList.contains("in")) return;
      const next = scrollDir === 1 ? `${distance}px` : `-${distance}px`;
      if (el.style.getPropertyValue("--from-y") !== next) el.style.setProperty("--from-y", next);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e) return;
        el.classList.toggle("in", e.isIntersecting);
        // leaving: glide away in the direction of the scroll
        if (!e.isIntersecting && vertical) {
          const next = scrollDir === 1 ? `-${distance}px` : `${distance}px`;
          el.style.setProperty("--from-y", next);
        }
      },
      { threshold: 0.15, rootMargin: "-5% 0px -5% 0px" },
    );
    io.observe(el);

    park();
    return () => io.disconnect();
  }, [ref, vertical, distance]);
}

/* ---------- reveal wrapper ---------- */
export function Reveal({
  children,
  dir = "left",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  dir?: "left" | "right" | "up" | "y";
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGlide(ref, dir === "y");
  const cls =
    dir === "right"
      ? "reveal reveal-right"
      : dir === "up"
        ? "reveal reveal-up"
        : dir === "y"
          ? "reveal reveal-y"
          : "reveal reveal-left";
  return (
    <div ref={ref} className={`${cls} ${className}`} style={{ "--delay": `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}

/* ---------- a link/button that glides on its own ---------- */
export function GlideLink({
  href,
  children,
  delay = 0,
  className = "",
}: {
  href: string;
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  useGlide(ref, true, 48);
  return (
    <a
      ref={ref}
      href={href}
      className={`reveal reveal-y inline-block ${className}`}
      style={{ "--delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </a>
  );
}

export function Photo({
  src,
  alt,
  w,
  h,
  eager,
}: {
  src: string;
  alt: string;
  w: number;
  h: number;
  eager?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: `${w}/${h}` }}>
      {!loaded && <div className="skeleton absolute inset-0" aria-hidden />}
      <img
        src={src}
        alt={alt}
        width={w}
        height={h}
        decoding="async"
        loading={eager ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        ref={(img) => {
          if (img?.complete) setLoaded(true);
        }}
        className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

export function Header() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (reducedMotion()) return;
    let last = window.scrollY;
    let goingDown = false;
    let raf = 0;
    const apply = () => {
      const y = window.scrollY;
      const d = y - last;
      if (d > 6) goingDown = true;
      else if (d < -6) goingDown = false;
      else return;
      last = y;
      setHidden(goingDown && y > 40);
    };
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <header className={`site-header sticky top-0 z-40 border-b bg-background ${hidden ? "is-hidden" : ""}`}>
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_auto] items-center justify-between gap-2 px-3 py-4 sm:flex sm:px-5">
          <Link
            to="/"
            data-header-logo
            className="header-logo shrink-0 whitespace-nowrap font-display text-[10px] font-bold leading-none sm:text-sm"
          >
            MOBILE<span className="text-primary">WORLD</span>
          </Link>
        <div className="ml-auto flex shrink-0 items-center gap-5">
          <nav className="hidden items-center gap-5 text-sm lg:flex" aria-label="Shop sections">
            <a href="/#services" className="text-muted-foreground">Services</a>
            <a href="/#process" className="text-muted-foreground">Process</a>
            <a href="/#audio" className="text-muted-foreground">Audio</a>
          </nav>
          <nav aria-label="Main navigation" className="flex shrink-0 items-center gap-1 whitespace-nowrap [&_.nav-link]:text-xs sm:[&_.nav-link]:text-sm">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              activeProps={{ className: "nav-link is-active" }}
              inactiveProps={{ className: "nav-link" }}
            >
              Home
            </Link>
            <Link
              to="/shop"
              activeProps={{ className: "nav-link is-active" }}
              inactiveProps={{ className: "nav-link" }}
            >
              Shop
            </Link>
            <Link
              to="/privacy"
              activeProps={{ className: "nav-link is-active" }}
              inactiveProps={{ className: "nav-link" }}
            >
              Privacy&Policy
            </Link>
          </nav>
        </div>

      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Mobile World. All repairs carry a written warranty.</p>
        <div className="flex shrink-0 flex-wrap gap-x-6 gap-y-3">
          <Link
            to="/terms"
            inactiveProps={{ className: "nav-foot" }}
            activeProps={{ className: "nav-foot is-active" }}
          >
            Terms of Service
          </Link>
          <Link
            to="/privacy"
            inactiveProps={{ className: "nav-foot" }}
            activeProps={{ className: "nav-foot is-active" }}
          >
            Privacy&Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  const blocks = Children.toArray(children);
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-16">
        <Reveal dir="up">
          <h1 className="break-words text-3xl font-bold sm:text-5xl">{title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: November 2026</p>
        </Reveal>
        <div className="mt-10 space-y-6 leading-relaxed text-muted-foreground [&_h2]:mt-10 [&_h2]:text-lg [&_h2]:text-foreground">
          {blocks.map((block, i) => (
            <Reveal key={i} dir="y" delay={90 + i * 70}>
              {block}
            </Reveal>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = document.documentElement;
      const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div
      ref={ref}
      className="fixed left-0 top-0 z-50 h-[3px] w-full origin-left bg-primary"
      style={{ transform: "scaleX(0)" }}
    />
  );
}

export function Parallax({ children, speed = 0.15 }: { children: ReactNode; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.parentElement!.getBoundingClientRect();
        const off = (r.top + r.height / 2 - window.innerHeight / 2) * -speed;
        el.style.transform = `translateY(${off}px) scale(1.15)`;
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  }, [speed]);
  return <div ref={ref} className="will-change-transform">{children}</div>;
}

/* ---------- intro: samurai slices a phone screen, the logo emerges and glides to the header ---------- */
const INTRO_KEY = "mw-intro-played";
const INTRO_SAMURAI_IN = 600;
const INTRO_SAMURAI_SLASH = 400;
const INTRO_LOGO_EMERGE = 700;
const INTRO_GLIDE = 850;
const INTRO_WORD_A = "MOBILE";
const INTRO_WORD_B = "WORLD";

function IntroLetters({ text, offset }: { text: string; offset: number }) {
  return (
    <>
      {text.split("").map((c, i) => (
        <span
          key={`${text}-${i}`}
          className="intro-letter"
          style={{ "--i": offset + i } as CSSProperties}
        >
          {c}
        </span>
      ))}
    </>
  );
}

function SamuraiSvg() {
  return (
    <svg
      viewBox="0 0 300 520"
      className="intro-samurai-svg"
      preserveAspectRatio="xMidYMax meet"
    >
      {/* katana — wrapped in a group so CSS can animate the swing */}
      <g className="intro-katana" style={{ transformOrigin: "168px 250px" }}>
        {/* blade */}
        <line x1={170} y1={250} x2={460} y2={248} strokeWidth={4} style={{ stroke: "var(--color-primary)", filter: "drop-shadow(0 0 6px var(--color-primary))" }} />
        <line x1={170} y1={250} x2={460} y2={248} strokeWidth={10} style={{ stroke: "var(--color-primary)", opacity: 0.12 }} />
        {/* tsuba (guard) */}
        <rect x={164} y={244} width={10} height={14} rx={2} style={{ fill: "var(--color-accent)" }} />
        {/* tsuka (handle) */}
        <line x1={150} y1={252} x2={166} y2={250} strokeWidth={7} style={{ stroke: "var(--color-foreground)" }} />
        {/* wrapping on handle */}
        <line x1={153} y1={251} x2={155} y2={254} strokeWidth={2} style={{ stroke: "var(--color-accent)" }} />
        <line x1={158} y1={251} x2={160} y2={254} strokeWidth={2} style={{ stroke: "var(--color-accent)" }} />
      </g>

      {/* kabuto (helmet) — domed top */}
      <path d="M 100 60 Q 150 18 200 60 L 205 85 L 95 85 Z" style={{ fill: "color-mix(in oklab, var(--color-foreground) 14%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 3 }} />
      {/* helmet crest (maedate) */}
      <path d="M 140 45 L 150 20 L 160 45 Z" style={{ fill: "var(--color-accent)", stroke: "var(--color-accent)", strokeWidth: 1 }} />
      {/* helmet rim */}
      <line x1={95} y1={85} x2={205} y2={85} strokeWidth={4} style={{ stroke: "var(--color-foreground)" }} />
      {/* shikoro (neck guard — layered plates fanning out) */}
      <path d="M 92 85 L 78 115 L 92 112 Z" style={{ fill: "color-mix(in oklab, var(--color-foreground) 10%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 2 }} />
      <path d="M 208 85 L 222 115 L 208 112 Z" style={{ fill: "color-mix(in oklab, var(--color-foreground) 10%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 2 }} />
      <path d="M 86 110 L 72 138 L 88 135 Z" style={{ fill: "color-mix(in oklab, var(--color-foreground) 8%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 2 }} />
      <path d="M 214 110 L 228 138 L 212 135 Z" style={{ fill: "color-mix(in oklab, var(--color-foreground) 8%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 2 }} />

      {/* menpo (face mask) */}
      <path d="M 110 88 Q 150 100 190 88 L 186 120 Q 150 130 114 120 Z" style={{ fill: "color-mix(in oklab, var(--color-foreground) 12%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 2.5 }} />
      {/* eye slits */}
      <line x1={122} y1={97} x2={138} y2={97} strokeWidth={3} style={{ stroke: "var(--color-primary)" }} />
      <line x1={162} y1={97} x2={178} y2={97} strokeWidth={3} style={{ stroke: "var(--color-primary)" }} />
      {/* nose bridge */}
      <line x1={148} y1={100} x2={152} y2={116} strokeWidth={2} style={{ stroke: "var(--color-foreground)", opacity: 0.5 }} />
      {/* mouth grill */}
      <line x1={136} y1={121} x2={164} y2={121} strokeWidth={1.5} style={{ stroke: "var(--color-foreground)" }} />
      <line x1={138} y1={117} x2={138} y2={125} strokeWidth={1.5} style={{ stroke: "var(--color-foreground)" }} />
      <line x1={146} y1={117} x2={146} y2={125} strokeWidth={1.5} style={{ stroke: "var(--color-foreground)" }} />
      <line x1={154} y1={117} x2={154} y2={125} strokeWidth={1.5} style={{ stroke: "var(--color-foreground)" }} />
      <line x1={162} y1={117} x2={162} y2={125} strokeWidth={1.5} style={{ stroke: "var(--color-foreground)" }} />

      {/* do (chest plate — cuirass) */}
      <path d="M 100 135 L 200 135 L 196 240 L 104 240 Z" style={{ fill: "color-mix(in oklab, var(--color-foreground) 14%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 3 }} />
      {/* chest lacing (odoshi) — horizontal rows */}
      <line x1={104} y1={155} x2={196} y2={155} strokeWidth={1.5} style={{ stroke: "var(--color-accent)", opacity: 0.6 }} />
      <line x1={104} y1={175} x2={196} y2={175} strokeWidth={1.5} style={{ stroke: "var(--color-accent)", opacity: 0.6 }} />
      <line x1={104} y1={195} x2={196} y2={195} strokeWidth={1.5} style={{ stroke: "var(--color-accent)", opacity: 0.6 }} />
      <line x1={104} y1={215} x2={196} y2={215} strokeWidth={1.5} style={{ stroke: "var(--color-accent)", opacity: 0.6 }} />
      {/* central seam */}
      <line x1={150} y1={135} x2={150} y2={240} strokeWidth={2} style={{ stroke: "var(--color-foreground)", opacity: 0.4 }} />
      {/* crest on chest */}
      <circle cx={150} cy={185} r={12} style={{ fill: "none", stroke: "var(--color-primary)", strokeWidth: 2 }} />
      <line x1={142} y1={185} x2={158} y2={185} strokeWidth={2} style={{ stroke: "var(--color-primary)" }} />
      <line x1={150} y1={177} x2={150} y2={193} strokeWidth={2} style={{ stroke: "var(--color-primary)" }} />

      {/* sode (shoulder guards — trapezoidal plates) */}
      <path d="M 100 135 L 78 135 L 70 185 L 98 185 Z" style={{ fill: "color-mix(in oklab, var(--color-foreground) 10%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 2.5 }} />
      <path d="M 200 135 L 222 135 L 230 185 L 202 185 Z" style={{ fill: "color-mix(in oklab, var(--color-foreground) 10%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 2.5 }} />
      {/* shoulder lacing */}
      <line x1={74} y1={150} x2={96} y2={150} strokeWidth={1} style={{ stroke: "var(--color-accent)", opacity: 0.5 }} />
      <line x1={72} y1={168} x2={97} y2={168} strokeWidth={1} style={{ stroke: "var(--color-accent)", opacity: 0.5 }} />
      <line x1={204} y1={150} x2={226} y2={150} strokeWidth={1} style={{ stroke: "var(--color-accent)", opacity: 0.5 }} />
      <line x1={203} y1={168} x2={228} y2={168} strokeWidth={1} style={{ stroke: "var(--color-accent)", opacity: 0.5 }} />

      {/* kusazuri (hip apron — layered strips hanging from waist) */}
      <path d="M 104 240 L 96 320 L 108 320 L 114 240 Z" style={{ fill: "color-mix(in oklab, var(--color-foreground) 10%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 2 }} />
      <path d="M 114 240 L 110 320 L 122 320 L 126 240 Z" style={{ fill: "color-mix(in oklab, var(--color-foreground) 10%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 2 }} />
      <path d="M 126 240 L 122 320 L 134 320 L 136 240 Z" style={{ fill: "color-mix(in oklab, var(--color-foreground) 10%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 2 }} />
      <path d="M 136 240 L 134 320 L 146 320 L 148 240 Z" style={{ fill: "color-mix(in oklab, var(--color-foreground) 10%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 2 }} />
      <path d="M 148 240 L 146 320 L 158 320 L 158 240 Z" style={{ fill: "color-mix(in oklab, var(--color-foreground) 10%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 2 }} />
      <path d="M 158 240 L 158 320 L 170 320 L 170 240 Z" style={{ fill: "color-mix(in oklab, var(--color-foreground) 10%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 2 }} />
      <path d="M 170 240 L 170 320 L 182 320 L 180 240 Z" style={{ fill: "color-mix(in oklab, var(--color-foreground) 10%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 2 }} />
      <path d="M 180 240 L 182 320 L 194 320 L 190 240 Z" style={{ fill: "color-mix(in oklab, var(--color-foreground) 10%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 2 }} />
      <path d="M 190 240 L 194 320 L 206 320 L 198 240 Z" style={{ fill: "color-mix(in oklab, var(--color-foreground) 10%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 2 }} />

      {/* arms — right arm holds katana forward */}
      <path d="M 200 145 L 225 170 L 215 220 L 195 210 Z" style={{ fill: "color-mix(in oklab, var(--color-foreground) 12%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 2.5 }} />
      {/* forearm to hand holding sword */}
      <line x1={210} y1={215} x2={172} y2={252} strokeWidth={9} style={{ stroke: "color-mix(in oklab, var(--color-foreground) 12%, var(--color-background))", strokeLinecap: "round" }} />
      <line x1={210} y1={215} x2={172} y2={252} strokeWidth={2.5} style={{ stroke: "var(--color-foreground)", strokeLinecap: "round" }} />
      {/* hand grip */}
      <circle cx={170} cy={252} r={5} style={{ fill: "color-mix(in oklab, var(--color-foreground) 20%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 2 }} />

      {/* left arm — at side */}
      <path d="M 100 145 L 78 170 L 86 215 L 98 200 Z" style={{ fill: "color-mix(in oklab, var(--color-foreground) 12%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 2.5 }} />
      <line x1={88} y1={210} x2={92} y2={245} strokeWidth={8} style={{ stroke: "color-mix(in oklab, var(--color-foreground) 12%, var(--color-background))", strokeLinecap: "round" }} />
      <line x1={88} y1={210} x2={92} y2={245} strokeWidth={2} style={{ stroke: "var(--color-foreground)", strokeLinecap: "round" }} />

      {/* hakama (wide trousers) */}
      <path d="M 96 320 L 80 440 L 110 440 L 120 320 Z" style={{ fill: "color-mix(in oklab, var(--color-foreground) 8%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 2.5 }} />
      <path d="M 120 320 L 112 440 L 148 440 L 148 320 Z" style={{ fill: "color-mix(in oklab, var(--color-foreground) 8%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 2.5 }} />
      <path d="M 148 320 L 148 440 L 188 440 L 180 320 Z" style={{ fill: "color-mix(in oklab, var(--color-foreground) 8%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 2.5 }} />
      <path d="M 180 320 L 190 440 L 220 440 L 204 320 Z" style={{ fill: "color-mix(in oklab, var(--color-foreground) 8%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 2.5 }} />

      {/* footwear (waraji sandals) */}
      <ellipse cx={95} cy={448} rx={18} ry={7} style={{ fill: "color-mix(in oklab, var(--color-accent) 40%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 2 }} />
      <ellipse cx={205} cy={448} rx={18} ry={7} style={{ fill: "color-mix(in oklab, var(--color-accent) 40%, var(--color-background))", stroke: "var(--color-foreground)", strokeWidth: 2 }} />

      {/* obi (belt) */}
      <rect x={100} y={238} width={100} height={8} style={{ fill: "var(--color-accent)", opacity: 0.7 }} />

      {/* glow aura */}
      <ellipse cx={150} cy={260} rx={70} ry={180} style={{ fill: "var(--color-primary)", opacity: 0.04 }} />
    </svg>
  );
}

export function Intro() {
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState<"idle" | "samurai" | "slash" | "emerge" | "glide" | "out">("idle");
  const mark = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let played = false;
    try {
      played = sessionStorage.getItem(INTRO_KEY) === "1";
    } catch {
      /* storage blocked: replaying the intro is harmless */
    }
    if (played || reducedMotion()) return;

    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* same */
    }

    const html = document.documentElement;
    html.classList.add("intro-live");
    setPlaying(true);

    const timers: number[] = [];
    let raf = 0;

    const finish = () => {
      html.classList.add("intro-done");
      html.classList.remove("intro-live", "intro-reveal");
      setPlaying(false);
    };

    const glide = () => {
      const m = mark.current;
      const w = word.current;
      const target = document.querySelector<HTMLElement>("[data-header-logo]");
      if (m && w && target) {
        const mr = m.getBoundingClientRect();
        const wr = w.getBoundingClientRect();
        const tr = target.getBoundingClientRect();
        const cx = wr.left + wr.width / 2;
        const cy = wr.top + wr.height / 2;
        m.style.setProperty("--origin-x", `${cx - mr.left}px`);
        m.style.setProperty("--origin-y", `${cy - mr.top}px`);
        m.style.setProperty("--glide-x", `${tr.left + tr.width / 2 - cx}px`);
        m.style.setProperty("--glide-y", `${tr.top + tr.height / 2 - cy}px`);
        m.style.setProperty("--glide-s", String(Math.max(0.05, tr.width / Math.max(1, wr.width))));
      }
      html.classList.add("intro-reveal");
      setPhase("glide");
      timers.push(window.setTimeout(() => setPhase("out"), INTRO_GLIDE));
      timers.push(window.setTimeout(finish, INTRO_GLIDE + 180));
    };

    raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => {
        setPhase("samurai");
        timers.push(window.setTimeout(() => setPhase("slash"), INTRO_SAMURAI_IN));
        timers.push(window.setTimeout(() => setPhase("emerge"), INTRO_SAMURAI_IN + INTRO_SAMURAI_SLASH));
        timers.push(window.setTimeout(glide, INTRO_SAMURAI_IN + INTRO_SAMURAI_SLASH + INTRO_LOGO_EMERGE));
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach((t) => window.clearTimeout(t));
      html.classList.add("intro-done");
      html.classList.remove("intro-live", "intro-reveal");
    };
  }, []);

  if (!playing) return null;

  return (
    <div className={`intro-splash is-${phase}`} aria-hidden="true">
      <div className="intro-floor" />
      <div className={`intro-samurai-wrap is-${phase}`}>
        <SamuraiSvg />
      </div>
      <div className={`intro-phone-screen is-${phase}`}>
        <div className="intro-phone-glow" />
        <div className="intro-phone-crack" />
      </div>
      <div className="intro-slash-fx is-${phase}">
        <span className="intro-slash-line" />
        <span className="intro-slash-flash" />
        <span className="intro-slash-shockwave" />
      </div>
      <div className="intro-burst" />
      <div ref={mark} className={`intro-mark is-${phase}`}>
        <div ref={word} className="intro-word">
          <IntroLetters text={INTRO_WORD_A} offset={0} />
          <span className="intro-word-b">
            <IntroLetters text={INTRO_WORD_B} offset={INTRO_WORD_A.length} />
          </span>
        </div>
        <div className="intro-tag">Phone repair &amp; audio</div>
      </div>
    </div>
  );
}
