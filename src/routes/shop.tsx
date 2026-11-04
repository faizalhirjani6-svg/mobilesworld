import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Minus, Plus } from "lucide-react";
import { Header, Footer, Reveal } from "@/components/site";
import { ShopCartSheet } from "@/components/shop-cart-sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { playAddToCartSound, playRemoveFromCartSound } from "@/lib/cart-sound";
import { SHOP_PRODUCTS, formatPrice, type ShopProduct } from "@/lib/shop-products";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop | Mobile World" },
      { name: "description", content: "Browse earbuds, headphones, chargers and accessories at Mobile World." },
      { property: "og:title", content: "Shop | Mobile World" },
      { property: "og:description", content: "Earbuds, headphones, chargers and accessories at Mobile World." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ShopPage,
});

/** Sends a small glowing dot arcing from the product card into the cart button. */
function flyToCart(card: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const target = document.querySelector<HTMLElement>("[data-cart-trigger]");
  if (!target) return;

  const from = card.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const startX = from.left + from.width / 2;
  const startY = from.top + from.height * 0.3;
  const endX = to.left + to.width / 2;
  const endY = to.top + to.height / 2;

  const dot = document.createElement("span");
  dot.className = "fly-dot";
  dot.style.left = `${startX - 7}px`;
  dot.style.top = `${startY - 7}px`;
  document.body.appendChild(dot);

  const dx = endX - startX;
  const dy = endY - startY;
  const flight = dot.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 1 },
      { transform: `translate(${dx * 0.55}px, ${dy * 0.55 - 90}px) scale(0.9)`, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.25)`, opacity: 0.2 },
    ],
    { duration: 650, easing: "cubic-bezier(.3, .7, .4, 1)" },
  );
  flight.onfinish = () => {
    dot.remove();
    target.classList.remove("cart-pop");
    void target.offsetWidth;
    target.classList.add("cart-pop");
    target.addEventListener("animationend", () => target.classList.remove("cart-pop"), { once: true });
  };
}

function ShopPage() {
  const { lines, add, setQuantity, itemCount, subtotal } = useCart();
  const quantities = new Map(lines.map((line) => [line.product.id, line.quantity]));
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const addedTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(addedTimer.current), []);

  const addToCart = (product: ShopProduct, origin?: HTMLElement | null) => {
    add(product);
    playAddToCartSound();
    setJustAdded(product.id);
    window.clearTimeout(addedTimer.current);
    addedTimer.current = window.setTimeout(() => setJustAdded(null), 750);
    const card = origin?.closest("article");
    if (card instanceof HTMLElement) flyToCart(card);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-5 py-16">
        <Reveal dir="up">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold sm:text-5xl">Shop</h1>
              <p className="mt-3 text-sm text-muted-foreground">Earbuds, headphones, chargers and accessories.</p>
            </div>
            <ShopCartSheet
              lines={lines}
              itemCount={itemCount}
              subtotal={subtotal}
              onSetQuantity={setQuantity}
            />
          </div>
        </Reveal>
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {SHOP_PRODUCTS.map((product, i) => {
            const quantity = quantities.get(product.id) ?? 0;
            return (
              <li key={product.id} className="flex">
                <Reveal dir="y" delay={i * 60} className="flex w-full">
                  <article
                    className={`flex aspect-square w-full flex-col overflow-hidden rounded-lg border bg-card text-card-foreground transition-shadow duration-300 hover:-translate-y-1 hover:shadow-md ${
                      justAdded === product.id ? "card-added" : ""
                    }`}
                  >
                    <div className="skeleton min-h-0 w-full flex-1" aria-hidden />
                    <div className="flex flex-col gap-1.5 p-2.5 sm:gap-2.5 sm:p-4">
                      <h2 className="truncate text-xs font-semibold sm:min-h-[2.5rem] sm:line-clamp-2 sm:text-base">
                        {product.name}
                      </h2>
                      <p className="text-xs font-bold text-primary sm:text-sm">{formatPrice(product.price)}</p>
                      {quantity === 0 ? (
                        <Button
                          className="h-8 w-full text-xs sm:h-9 sm:text-sm"
                          onClick={(e) => addToCart(product, e.currentTarget)}
                        >
                          Add to cart
                        </Button>
                      ) : (
                        <div className="flex items-center justify-between rounded-md border border-blue-600 bg-blue-600 text-white transition-colors duration-300">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-white hover:bg-white/20 hover:text-white sm:h-9 sm:w-9"
                            aria-label={`Remove one ${product.name} from cart`}
                            onClick={() => {
                              setQuantity(product.id, quantity - 1);
                              playRemoveFromCartSound();
                            }}
                          >
                            <Minus className="h-4 w-4" aria-hidden />
                          </Button>
                          <span key={quantity} className="count-pop text-xs font-semibold sm:text-sm" aria-live="polite">
                            In cart: {quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-white hover:bg-white/20 hover:text-white sm:h-9 sm:w-9"
                            aria-label={`Add one more ${product.name} to cart`}
                            onClick={(e) => addToCart(product, e.currentTarget)}
                          >
                            <Plus className="h-4 w-4" aria-hidden />
                          </Button>
                        </div>
                      )}
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
