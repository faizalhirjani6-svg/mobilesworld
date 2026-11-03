import { createFileRoute } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
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

function ShopPage() {
  const { lines, add, setQuantity, itemCount, subtotal } = useCart();
  const quantities = new Map(lines.map((line) => [line.product.id, line.quantity]));

  const addToCart = (product: ShopProduct) => {
    add(product);
    playAddToCartSound();
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
                  <article className="flex w-full flex-col overflow-hidden rounded-lg border bg-card text-card-foreground transition-shadow duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="skeleton aspect-square w-full" aria-hidden />
                    <div className="flex flex-1 flex-col gap-3 p-4">
                      <h2 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold sm:text-base">{product.name}</h2>
                      <p className="mt-auto text-sm font-bold text-primary">{formatPrice(product.price)}</p>
                      {quantity === 0 ? (
                        <Button className="w-full" onClick={() => addToCart(product)}>
                          Add to cart
                        </Button>
                      ) : (
                        <div className="flex items-center justify-between rounded-md border border-blue-600 bg-blue-600 text-white transition-colors duration-300">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-white hover:bg-white/20 hover:text-white"
                            aria-label={`Remove one ${product.name} from cart`}
                            onClick={() => {
                              setQuantity(product.id, quantity - 1);
                              playRemoveFromCartSound();
                            }}
                          >
                            <Minus className="h-4 w-4" aria-hidden />
                          </Button>
                          <span key={quantity} className="count-pop text-sm font-semibold" aria-live="polite">
                            In cart: {quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-white hover:bg-white/20 hover:text-white"
                            aria-label={`Add one more ${product.name} to cart`}
                            onClick={() => addToCart(product)}
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
