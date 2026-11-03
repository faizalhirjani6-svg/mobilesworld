import phoneFront from "@/assets/phone-front.png";
import phoneBack from "@/assets/phone-back.png";
import type { CSSProperties } from "react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header, Footer, Reveal, Photo, ScrollProgress, GlideLink } from "@/components/site";
import { ShopPhotoStrip } from "@/components/shop-photo-strip";
import shopShelves from "@/assets/shop-shelves-enhanced.jpg";
import shopChargers from "@/assets/shop-chargers-enhanced.jpg";
import shopStickers from "@/assets/shop-stickers-enhanced.jpg";
import shopWorkbench from "@/assets/shop-workbench-enhanced.jpg";
import shopCases from "@/assets/shop-cases-enhanced.jpg";
import earbuds from "@/assets/earbuds-hand-real.jpg";
import headphones from "@/assets/headphones.jpg";
import wired from "@/assets/wired.jpg";
import neckband from "@/assets/neckband.jpg";
import speaker from "@/assets/bluetooth-speaker.jpg";
import powerBank from "@/assets/power-bank.jpg";
import fingerSleeves from "@/assets/finger-sleeves.jpg";
import temperedGlass from "@/assets/tempered-glass.jpg";
import phoneCases from "@/assets/phone-cases.jpg";
import chargingCable from "@/assets/charging-cable.jpg";
import smartwatch from "@/assets/smartwatch.jpg";
import wirelessCharger from "@/assets/wireless-charger.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mobile World | Phone Repair and Audio Shop" },
      { name: "description", content: "Mobile World fixes cracked screens, batteries and water damage, and sells new earbuds, headphones and wired earphones." },
      { property: "og:title", content: "Mobile World | Phone Repair and Audio Shop" },
      { property: "og:description", content: "Phone repairs done fast, plus new earbuds, headphones and wired earphones." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const services = [
  ["01", "Screen replacement", "Cracked glass or dead display swapped for a quality panel, usually within the hour."],
  ["02", "Battery replacement", "Phone dying by lunch? A fresh cell brings back full-day life."],
  ["03", "Charging port repair", "Loose cable, no charge. We clean or replace the port."],
  ["04", "Water damage", "Ultrasonic cleaning and board-level checks to bring wet phones back."],
  ["05", "Camera and speaker", "Blurry photos, muffled calls, broken mic. Parts replaced and tested."],
  ["06", "Software and data", "Stuck boot loops, unlock help, and safe data transfer to a new phone."],
];

const audio = [
  { img: earbuds, name: "Wireless earbuds", line: "True wireless with a charging case. Try a pair at the counter." },
  { img: headphones, name: "Over-ear headphones", line: "Big sound, soft cushions and a battery that lasts the trip." },
  { img: wired, name: "Wired earphones", line: "3.5mm and USB-C options. Plug in and play." },
  { img: neckband, name: "Neckband earphones", line: "Light around the neck, magnetic buds, all-day battery." },
  { img: speaker, name: "Bluetooth speaker", line: "Room-filling sound in a pocket-sized body." },
  { img: smartwatch, name: "Smartwatch", line: "Calls, steps and notifications on your wrist." },
];

const extras = [
  { img: powerBank, name: "Power bank", line: "Fast top-ups on the go, with USB-C and USB-A ports." },
  { img: fingerSleeves, name: "Gaming finger sleeves", line: "Smooth, sweat-proof sleeves for sharper taps." },
  { img: temperedGlass, name: "Tempered glass", line: "Scratch-proof screen protection, fitted at the counter." },
  { img: phoneCases, name: "Phone cases", line: "Slim, clear and rugged cases for most models." },
  { img: chargingCable, name: "Cables & wall charger", line: "Braided USB-C and Lightning cables with a fast wall plug." },
  { img: wirelessCharger, name: "Wireless charger", line: "Set your phone down and it tops up, no cable hunting." },
];

function ShopGrid({ items, start = 1 }: { items: { img: string; name: string; line: string }[]; start?: number }) {
  return (
    <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6">
      {items.map((a, i) => (
        <Reveal key={a.name} dir="y" delay={i * 80} className="min-w-0">
          <article>
            <Photo src={a.img} alt={a.name} w={1} h={1} />
            <div className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-2 sm:gap-3">
              <span className="shrink-0 font-display text-xs text-primary">{String(start + i).padStart(2, "0")}</span>
              <h3 className="min-w-0 break-words text-base font-bold leading-tight sm:text-2xl">{a.name}</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">{a.line}</p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

const steps = [
  ["Drop in", "Bring your phone to the counter. No appointment needed."],
  ["Free check", "We find the fault and give you a fixed price before any work."],
  ["Repair", "Most jobs are finished the same day while you wait."],
  ["Pick up", "Collect your phone with a written warranty on part and labour."],
];

const brands = ["Apple", "Samsung", "OnePlus", "Xiaomi", "Vivo", "Oppo", "Realme", "Google Pixel", "Motorola", "Nothing"];

function Index() {
  const phoneStage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const stage = phoneStage.current;
    if (!stage) return;
    let visible = true;
    const update = () => stage.toggleAttribute("data-motion-paused", !visible || document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      update();
    });
    observer.observe(stage);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return (
    <div className="min-h-screen overflow-x-clip">
      <ScrollProgress />
      <Header />


      {/* Opening text over the decorative phone animation */}
      <section className="opening-section relative isolate overflow-hidden">
      <div ref={phoneStage} aria-hidden="true" className="stage3d hero-phone-background">
        <div className="stage3d-grid" />
        <div className="p3-shadow" />
        <div className="stage3d-track"><div className="p3-lift">
          <div className="phone3d">
            <div className="p3-slice" style={{ "--z": "-4px" } as CSSProperties} /><div className="p3-slice" style={{ "--z": "-3px" } as CSSProperties} /><div className="p3-slice" style={{ "--z": "-2px" } as CSSProperties} /><div className="p3-slice" style={{ "--z": "-1px" } as CSSProperties} /><div className="p3-slice" style={{ "--z": "0px" } as CSSProperties} /><div className="p3-slice" style={{ "--z": "1px" } as CSSProperties} /><div className="p3-slice" style={{ "--z": "2px" } as CSSProperties} /><div className="p3-slice" style={{ "--z": "3px" } as CSSProperties} /><div className="p3-slice" style={{ "--z": "4px" } as CSSProperties} />
            <div className="p3-board"><span className="p3-chip" /><span className="p3-batt" /><span className="p3-camera" /><span className="p3-connector" /></div>
            <div className="p3-front">
              <img src={phoneFront} alt="" width={576} height={1168} />
              <div className="p3-wall">
                <div className="p3-mark" aria-hidden="true">
                  <div className="p3-emblem"><span>MW</span><i /></div>
                  <div className="p3-wordmark"><span>MOBILE</span><span>WORLD</span></div>
                  <div className="p3-mark-line" />
                </div>
              </div>
              <span className="p3-glare" />
            </div>
            <div className="p3-back"><img src={phoneBack} alt="" width={576} height={1168} /></div>
          </div>
          <div className="p3-halo"><span /><span /></div>
        </div></div>
        <div className="stage3d-orbit"><span /><span /><span /></div>
      </div>
        <div className="opening-content relative z-10 mx-auto flex max-w-6xl flex-col justify-end px-5 pb-12 pt-12 sm:pb-16">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Repairs and audio</p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-5 text-5xl font-black leading-[0.95] sm:text-8xl">
              Fix it.
              <br />
              <span className="font-serif font-normal italic text-accent">Hear it.</span>
              <br />
              <span className="text-primary">Love it.</span>
            </h1>
          </Reveal>
          <Reveal delay={260}>
            <p className="mt-7 max-w-md text-lg text-muted-foreground">
              Mobile World brings broken phones back to life and sells fresh earbuds and headphones, all from one counter.
            </p>
          </Reveal>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-lg font-semibold">
            <GlideLink href="#visit" delay={380} className="cta-chip text-base no-underline hover:brightness-110">
              Book a repair →
            </GlideLink>
            <GlideLink href="#audio" delay={500} className="underline decoration-accent decoration-2 underline-offset-8">
              Shop audio
            </GlideLink>
          </div>

        </div>
      </section>

      <div className="overflow-hidden border-y py-5">
        <div className="ticker flex w-max gap-12 whitespace-nowrap font-display text-2xl font-bold uppercase">
          {[...brands, ...brands].map((b, i) => (
            <span key={i} className={i % 2 ? "text-outline" : "text-primary"}>{b}</span>
          ))}
        </div>
      </div>

      {/* Services */}
      <section id="services" className="mx-auto max-w-6xl px-5 py-24">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.25em] text-accent">Repair</p>
          <h2 className="mt-3 text-4xl font-black sm:text-6xl">What we fix</h2>
        </Reveal>
        <div className="mt-12">
          {services.map(([n, t, d], i) => (
            <Reveal key={n} dir={i % 2 ? "right" : "left"}>
              <div className="grid gap-2 border-b py-8 sm:grid-cols-[60px_minmax(0,1fr)_minmax(0,1.3fr)] sm:items-baseline lg:grid-cols-[100px_minmax(0,1fr)_minmax(0,1.3fr)]">
                <span className="font-display text-3xl font-black text-outline">{n}</span>
                <h3 className="text-2xl font-bold">{t}</h3>
                <p className="text-muted-foreground">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Shop: everything in stock, laid out so it all shows */}
      <section id="audio" className="py-24">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.25em] text-primary">New in store</p>
            <h2 className="mt-3 text-4xl font-black sm:text-6xl">
              Sound <span className="font-serif font-normal italic text-accent">& extras</span>
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Earbuds, neckbands, speakers, smartwatches, power banks, wireless chargers, protective glass, cases and cables. All on the counter.
            </p>
          </Reveal>

          <ShopGrid items={audio} />

          <Reveal dir="y" className="mt-20">
            <h3 className="text-3xl font-black sm:text-5xl">
              Counter <span className="font-serif font-normal italic text-accent">extras</span>
            </h3>
          </Reveal>

          <ShopGrid items={extras} start={audio.length + 1} />

          <Reveal dir="y">
            <p className="mt-14 text-lg">
              Ask at the counter for today's stock and prices.{" "}
              <a href="#visit" className="font-semibold text-primary underline decoration-2 underline-offset-8">
                Find us
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Inside the shop */}
      <section id="shop-gallery" className="py-24">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.25em] text-primary">Inside Mobile World</p>
            <h2 className="mt-3 text-4xl font-black sm:text-6xl">
              Real bench. <span className="font-serif font-normal italic text-accent">Real people.</span>
            </h2>
          </Reveal>
        </div>
        <ShopPhotoStrip>
          {[
            [shopShelves, "Audio and accessories arranged on the shop shelves", 1024, 768, "Around the shop"],
            [shopChargers, "Chargers and cables in the glass display", 1024, 768, "Chargers & cables"],
            [shopCases, "Phone cases displayed on wall hooks and racks", 1024, 768, "Cases for every style"],
            [shopStickers, "Decorative phone skins and stickers in the shop", 1024, 768, "Skins & stickers"],
            [shopWorkbench, "The shop repair workbench with tools and equipment", 1024, 768, "Our repair bench"],
          ].map(([src, alt, , , cap]) => (
            <div key={cap as string} className="min-w-0 w-[82vw] shrink-0 sm:w-[50vw] lg:w-[40vw]">
              <figure>
                <Photo src={src as string} alt={alt as string} w={4} h={3} eager />
                <figcaption className="mt-3 font-serif text-xl italic text-muted-foreground">{cap as string}</figcaption>
              </figure>
            </div>
          ))}
        </ShopPhotoStrip>
      </section>

      {/* Process: big numbers, open layout */}
      <section id="process" className="bg-accent text-accent-foreground">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <Reveal>
            <h2 className="text-4xl font-black sm:text-6xl">How it works</h2>
          </Reveal>
          <ol className="mt-14 space-y-12">
            {steps.map(([t, d], i) => (
              <Reveal key={t} dir={i % 2 ? "right" : "left"}>
                <li className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-6 sm:flex sm:gap-10 ${i % 2 ? "sm:flex-row-reverse sm:text-right" : ""}`}>
                  <span className="shrink-0 font-display text-7xl font-black text-background sm:text-9xl">{i + 1}</span>
                  <div className="min-w-0">
                    <h3 className="text-2xl font-bold sm:text-3xl">{t}</h3>
                    <p className="mt-1 max-w-sm opacity-85">{d}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Visit */}
      <section id="visit">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 md:grid-cols-2">
          <Reveal>
            <h2 className="text-5xl font-black sm:text-7xl">
              Come say <span className="text-primary">hi.</span>
            </h2>
            <p className="mt-5 max-w-sm text-muted-foreground">Walk in any time during opening hours. Diagnosis is always free.</p>
          </Reveal>
          <Reveal dir="right" delay={150}>
            <dl className="divide-y">
              {(
                [
                  [
                    "Address",
                    <a
                      href="https://maps.app.goo.gl/LVB46TUdSm3oe74D9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-2 underline-offset-4 hover:text-primary"
                    >
                      Anjani Residency,
                      <br />
                      near Iscon Temple, Jahangipura,
                      <br />
                      Rander, Surat, Gujarat
                    </a>,
                  ],
                  [
                    "Phone",
                    <a href="tel:+919104262340" className="underline decoration-2 underline-offset-4 hover:text-primary">
                      +91 91042 62340
                    </a>,
                  ],
                  ["Hours", <>9:00 AM &ndash; 10:00 PM</>],
                ] as [string, ReactNode][]
              ).map(([k, v]) => (
                <div key={k} className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 py-5 sm:gap-6">
                  <dt className="shrink-0 text-sm uppercase tracking-widest text-muted-foreground">{k}</dt>
                  <dd className="min-w-0 break-words text-right font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
