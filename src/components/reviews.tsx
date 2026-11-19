import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Reveal } from "@/components/site";

const reviews = [
  {
    name: "Priya Sharma",
    rating: 5,
    service: "Screen replacement",
    text: "Dropped my iPhone face-down and the screen was completely shattered. Mobile World fixed it in under an hour and it looks brand new. Genuinely cannot tell it was ever broken.",
  },
  {
    name: "Rahul Patel",
    rating: 5,
    service: "Battery replacement",
    text: "My phone was dying by lunchtime every day. They swapped the battery and now it lasts a full day again. Fair price, fast work, and a written warranty on the spot.",
  },
  {
    name: "Aisha Khan",
    rating: 5,
    service: "Water damage",
    text: "Phone fell in water and wouldn\u2019t turn on. Another shop said it was dead. Mobile World cleaned the board and brought it back to life. All my photos were saved.",
  },
  {
    name: "Vikram Singh",
    rating: 5,
    service: "Charging port repair",
    text: "Cable was wobbly and wouldn\u2019t charge unless I held it at an angle. They cleaned out the port and replaced the connector. Charges perfectly now.",
  },
  {
    name: "Neha Desai",
    rating: 5,
    service: "Earbuds purchase",
    text: "Bought a pair of wireless earbuds here. The staff let me try three different pairs before I chose one. Great sound and honestly better service than any big store.",
  },
];

export function Reviews() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setActive((i) => (i + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, [auto]);

  return (
    <section id="reviews" className="mx-auto max-w-6xl px-5 py-24">
      <Reveal>
        <p className="text-sm uppercase tracking-[0.25em] text-accent">Reviews</p>
        <h2 className="mt-3 text-4xl font-black sm:text-6xl">What people say.</h2>
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-center">
        {/* Active quote */}
        <Reveal dir="y">
          <div className="relative min-h-[260px]">
            {reviews.map((r, i) => (
              <blockquote
                key={i}
                className={`absolute inset-0 transition-all duration-700 ${
                  i === active ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-4"
                }`}
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: r.rating }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-xl font-semibold leading-snug sm:text-2xl">\u201c{r.text}\u201d</p>
                <footer className="mt-5">
                  <p className="font-bold">{r.name}</p>
                  <p className="text-sm text-muted-foreground">{r.service}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </Reveal>
        {/* Selector list */}
        <Reveal dir="right" delay={120}>
          <div className="flex flex-col gap-1">
            {reviews.map((r, i) => (
              <button
                key={i}
                onClick={() => { setAuto(false); setActive(i); }}
                className={`flex items-center gap-3 border-l-2 py-3 pl-4 text-left transition-colors ${
                  i === active ? "border-primary text-foreground" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, s) => (
                    <Star key={s} className="h-3 w-3 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-semibold">{r.name}</span>
                <span className="ml-auto text-xs opacity-60">{r.service}</span>
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
