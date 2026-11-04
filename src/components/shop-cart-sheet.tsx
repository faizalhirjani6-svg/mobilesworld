import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import type { CartLine } from "@/hooks/use-cart";
import { playAddToCartSound, playRemoveFromCartSound } from "@/lib/cart-sound";
import { formatPrice } from "@/lib/shop-products";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function ShopCartSheet({
  lines,
  itemCount,
  subtotal,
  onSetQuantity,
}: {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  onSetQuantity: (id: string, quantity: number) => void;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2" data-cart-trigger>
          <ShoppingBag className="h-4 w-4" aria-hidden />
          Cart (<span key={itemCount} className="count-pop">{itemCount}</span>)
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your cart</SheetTitle>
          <SheetDescription>
            {itemCount === 0 ? "Nothing added yet." : `${itemCount} ${itemCount === 1 ? "item" : "items"} in your cart.`}
          </SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">
            Your cart is empty. Add an item from the shop and it will appear here.
          </p>
        ) : (
          <>
            <ul className="mt-6 flex-1 divide-y overflow-y-auto">
              {lines.map(({ product, quantity }) => (
                <li key={product.id} className="flex items-center gap-4 py-4">
                  <div className="skeleton h-14 w-14 shrink-0 rounded-md" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      aria-label={`Decrease quantity of ${product.name}`}
                      onClick={() => {
                        onSetQuantity(product.id, quantity - 1);
                        playRemoveFromCartSound();
                      }}
                    >
                      <Minus className="h-4 w-4" aria-hidden />
                    </Button>
                    <span className="w-6 text-center text-sm font-semibold" aria-live="polite">
                      {quantity}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      aria-label={`Increase quantity of ${product.name}`}
                      onClick={() => {
                        onSetQuantity(product.id, quantity + 1);
                        playAddToCartSound();
                      }}
                    >
                      <Plus className="h-4 w-4" aria-hidden />
                    </Button>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Remove ${product.name} from cart`}
                    onClick={() => {
                      onSetQuantity(product.id, 0);
                      playRemoveFromCartSound();
                    }}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </Button>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t pt-4 text-sm font-semibold">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
