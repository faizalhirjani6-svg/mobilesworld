import { useCallback, useRef, useState, type CSSProperties } from "react";
import { Reveal } from "@/components/site";
import { Photo } from "@/components/site";
import phoneFront from "@/assets/phone-front.png";
import phoneBack from "@/assets/phone-back.png";

const repairs: {
  before: string;
  after: string;
  label: string;
  desc: string;
}[] = [
  { before: phoneFront, after: phoneFront, label: "Screen replacement", desc: "Cracked glass swapped for a clean panel." },
  { before: phoneBack, after: phoneBack, label: "Back panel repair", desc: "Shattered rear glass made whole again." },
  { before: phoneFront, after: phoneFront, label: "Display revival", desc: "Dead pixels and lines brought back to life." },
];

function Slider({ before, after, label }: { before: string; after: string; label: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }, []);

  return (
    <div
      ref={ref}
      className="ba-slider relative cursor-ew-resize overflow-hidden rounded-lg border select-none"
      onMouseDown={(e) => {
        dragging.current = true;
        update(e.clientX);
      }}
      onMouseMove={(e) => dragging.current && update(e.clientX)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchStart={(e) => update(e.touches[0].clientX)}
      onTouchMove={(e) => update(e.touches[0].clientX)}
    >
      {/* After (clean) — bottom layer */}
      <div className="ba-layer ba-after">
        <Photo src={after} alt={`${label} — after repair`} w={1} h={1} eager />
      </div>
      {/* Before (cracked) — clipped top layer */}
      <div className="ba-layer ba-before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` } as CSSProperties}>
        <Photo src={before} alt={`${label} — before repair`} w={1} h={1} eager />
        <div className="ba-crackle" aria-hidden />
        <span className="ba-badge ba-badge-before">Before</span>
      </div>
      <span className="ba-badge ba-badge-after">After</span>
      {/* Handle */}
      <div className="ba-handle" style={{ left: `${pos}%` } as CSSProperties}>
        <span className="ba-handle-line" />
        <span className="ba-handle-grip">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
      </div>
    </div>
  );
}

export function BeforeAfter() {
  return (
    <section id="our-work" className="mx-auto max-w-6xl px-5 py-24">
      <Reveal>
        <p className="text-sm uppercase tracking-[0.25em] text-accent">Our work</p>
        <h2 className="mt-3 text-4xl font-black sm:text-6xl">
          Before <span className="font-serif font-normal italic text-accent">&amp; after</span>
        </h2>
        <p className="mt-4 max-w-md text-muted-foreground">
          Drag the handle to see the difference. Every repair carries a written warranty.
        </p>
      </Reveal>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {repairs.map((r, i) => (
          <Reveal key={r.label} dir="y" delay={i * 100}>
            <figure>
              <Slider before={r.before} after={r.after} label={r.label} />
              <figcaption className="mt-4">
                <h3 className="text-sm font-bold sm:text-lg">{r.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
