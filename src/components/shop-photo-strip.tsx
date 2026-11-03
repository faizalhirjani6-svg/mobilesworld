import { useEffect, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

export function ShopPhotoStrip({ children }: { children: ReactNode }) {
  const [viewportRef, carousel] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [AutoScroll({ speed: 0.7, startDelay: 0, playOnInit: false, stopOnInteraction: false, stopOnMouseEnter: true })],
  );

  useEffect(() => {
    const viewport = carousel?.rootNode();
    const motion = carousel?.plugins().autoScroll;
    if (!viewport || !motion) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const update = () => {
      if (visible && !preference.matches && !document.hidden) motion.play();
      else motion.stop();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      update();
    });
    observer.observe(viewport);
    preference.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      motion.stop();
    };
  }, [carousel]);

  return (
    <div ref={viewportRef} role="region" aria-label="Shop photos" aria-roledescription="carousel" className="mt-12 overflow-hidden">
      <div className="flex touch-pan-y gap-6 px-5 pb-4 md:px-10">{children}</div>
    </div>
  );
}