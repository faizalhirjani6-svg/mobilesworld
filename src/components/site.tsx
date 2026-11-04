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

/* ---------- intro: a sword cuts the logo in half, the top half flies up to become the header logo ---------- */
const INTRO_KEY = "mw-intro-played";
const INTRO_HOLD = 1600;
const INTRO_SWORD = 200;
const INTRO_SPLIT = 1100;
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

function IntroWordContent() {
  return (
    <>
      <IntroLetters text={INTRO_WORD_A} offset={0} />
      <span className="intro-word-b">
        <IntroLetters text={INTRO_WORD_B} offset={INTRO_WORD_A.length} />
      </span>
    </>
  );
}

export function Intro() {
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState<"idle" | "in" | "cut" | "split" | "out">("idle");
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

    const doCut = () => {
      setPhase("cut");
      timers.push(window.setTimeout(() => {
        const w = word.current;
        const target = document.querySelector<HTMLElement>("[data-header-logo]");
        if (w && target) {
          const wr = w.getBoundingClientRect();
          const tr = target.getBoundingClientRect();
          w.style.setProperty("--fly-x", `${tr.left + tr.width / 2 - (wr.left + wr.width / 2)}px`);
          w.style.setProperty("--fly-y", `${tr.top + tr.height / 2 - (wr.top + wr.height / 2)}px`);
          w.style.setProperty("--fly-s", String(Math.max(0.05, tr.width / Math.max(1, wr.width))));
        }
        html.classList.add("intro-reveal");
        setPhase("split");
      }, 900));
      timers.push(window.setTimeout(finish, 900 + INTRO_SPLIT));
    };

    raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => {
        setPhase("in");
        timers.push(window.setTimeout(doCut, INTRO_HOLD));
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
      <div ref={mark} className="intro-mark">
        <div ref={word} className="intro-word-wrap">
          <div className="intro-half intro-half-top">
            <div className="intro-half-inner">
              <IntroWordContent />
            </div>
          </div>
          <div className="intro-half intro-half-bottom">
            <div className="intro-half-inner">
              <IntroWordContent />
            </div>
          </div>
        </div>
        <div className="intro-tag">Phone repair &amp; audio</div>
      </div>
      <div className="intro-sword" aria-hidden="true">
        <div className="intro-stickman">
          <svg
            viewBox="0 0 360 240"
            className="intro-stickman-svg"
            preserveAspectRatio="xMinYMid meet"
            style={{ stroke: "var(--color-foreground)", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" }}
          >
            <ellipse cx={20} cy={120} rx={14} ry={30} opacity={0.15} style={{ stroke: "var(--color-primary)", strokeWidth: 6 }} />
            <ellipse cx={8} cy={120} rx={10} ry={24} opacity={0.08} style={{ stroke: "var(--color-primary)", strokeWidth: 8 }} />
            <circle cx={52} cy={52} r={3} style={{ stroke: "var(--color-accent)", strokeWidth: 2.5 }} />
            <line x1={52} y1={55} x2={56} y2={64} strokeWidth={2} style={{ stroke: "var(--color-accent)" }} />
            <path d="M 30 64 Q 52 42, 74 64 Q 70 60, 52 58 Q 34 60, 30 64" strokeWidth={2.5} style={{ stroke: "var(--color-accent)" }} />
            <line x1={30} y1={64} x2={74} y2={64} strokeWidth={2} style={{ stroke: "var(--color-accent)", opacity: 0.5 }} />
            <circle cx={52} cy={72} r={10} />
            <line x1={48} y1={70} x2={56} y2={71} strokeWidth={2} style={{ stroke: "var(--color-primary)" }} />
            <line x1={52} y1={82} x2={62} y2={140} strokeWidth={4} />
            <line x1={55} y1={96} x2={30} y2={110} strokeWidth={3} />
            <line x1={30} y1={110} x2={18} y2={104} strokeWidth={2.5} />
            <line x1={58} y1={98} x2={86} y2={108} strokeWidth={3.5} />
            <line x1={84} y1={102} x2={92} y2={114} strokeWidth={5} style={{ stroke: "var(--color-accent)" }} />
            <line x1={92} y1={108} x2={350} y2={108} strokeWidth={2.5} style={{ stroke: "var(--color-primary)" }} />
            <line x1={345} y1={105} x2={355} y2={108} strokeWidth={1.5} style={{ stroke: "var(--color-primary)" }} />
            <line x1={345} y1={111} x2={355} y2={108} strokeWidth={1.5} style={{ stroke: "var(--color-primary)" }} />
            <line x1={92} y1={108} x2={350} y2={108} strokeWidth={6} style={{ stroke: "var(--color-primary)", opacity: 0.15 }} />
            <line x1={62} y1={140} x2={90} y2={195} strokeWidth={3.5} />
            <line x1={62} y1={140} x2={34} y2={195} strokeWidth={3.5} />
            <line x1={85} y1={195} x2={98} y2={193} strokeWidth={3} />
            <line x1={30} y1={195} x2={20} y2={193} strokeWidth={3} />
          </svg>
          <span className="intro-speed-lines" />
        </div>
        <span className="intro-cut-line" />
        <span className="intro-cut-flash" />
        <span className="intro-shockwave" />
        <span className="intro-sparks" />
      </div>
    </div>
  );
}
