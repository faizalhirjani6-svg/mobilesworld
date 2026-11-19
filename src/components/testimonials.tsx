import { useEffect, useState, type CSSProperties } from "react";
import { Star, Quote } from "lucide-react";
import { Reveal } from "@/components/site";

const reviews: {
  name: string;
  initials: string;
  rating: number;
  text: string;
  device: string;
}[] = [
  {
    name: "Rahil Sheikh",
    initials: "RS",
    rating: 5,
    text: "Cracked my iPhone screen badly. These guys fixed it in under an hour and it looks brand new. Fair price, honest people.",
    device: "iPhone 13 Pro",
  },
  {
    name: "Priya Mehta",
    initials: "PM",
    rating: 5,
    text: "My phone was not charging at all. They cleaned the port in 10 minutes and charged almost nothing. Will not go anywhere else.",
    device: "Samsung Galaxy S22",
  },
  {
    name: "Arjun Patel",
    initials: "AP",
    rating: 5,
    text: "Bought a pair of earbuds here and the sound quality is amazing for the price. The staff actually let me try before buying.",
    device: "Aurora Buds",
  },
  {
    name: "Sana Khan",
    initials: "SK",
    rating: 5,
    text: "Dropped my phone in water. Thought it was gone. They brought it back to life and recovered all my photos. Lifesavers.",
    device: "OnePlus Nord",
  },
  {
    name: "Vivek Desai",
    initials: "VD",
    rating: 4,
    text: "Good service. Battery replacement done same day. Phone lasts a full day again. Would recommend to anyone in Surat.",
    device: "Xiaomi Redmi Note 12",
  },
];

export function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActive((p) => (p + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <section id="reviews" className="py-24">
      <div className="mx-auto max-w-4xl px-5">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.25em] text-primary">Reviews</p>
          <h2 className="mt-3 text-4xl font-black sm:text-6xl">
            What people <span className="font-serif font-normal italic text-accent">say</span>
          </h2>
        </Reveal>
        <Reveal dir="y" delay={120}>
          <div
            className="mt-12 overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Track */}
            <div
              className="testimonial-track flex transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
              style={{ transform: `translateX(-${active * 100}%)` } as CSSProperties}
            >
              {reviews.map((r, i) => (
                <div key={i} className="testimonial-slide w-full shrink-0 px-1">
                  <div className="testimonial-card relative rounded-lg border bg-card p-8 sm:p-12">
                    <Quote className="testimonial-quote absolute right-6 top-6 h-12 w-12 text-primary opacity-20" aria-hidden />
                    <div className="flex gap-1" aria-label={`${r.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star
                          key={s}
                          className={`h-5 w-5 ${s < r.rating ? "fill-primary text-primary" : "text-muted-foreground/40"}`}
                          aria-hidden
                        />
                      ))}
                    </div>
                    <p className="mt-6 text-lg leading-relaxed text-foreground sm:text-2xl">
                      &ldquo;{r.text}&rdquo;
                    </p>
                    <div className="mt-8 flex items-center gap-4">
                      <div className="testimonial-avatar flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">
                        {r.initials}
                      </div>
                      <div>
                        <p className="font-bold">{r.name}</p>
                        <p className="text-sm text-muted-foreground">{r.device}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Dots */}
            <div className="mt-8 flex justify-center gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  className={`testimonial-dot h-2 rounded-full transition-all duration-300 ${i === active ? "w-8 bg-primary" : "w-2 bg-muted hover:bg-muted-foreground/50"}`}
                  aria-label={`Go to review ${i + 1}`}
                  onClick={() => setActive(i)}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
