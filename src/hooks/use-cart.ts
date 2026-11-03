import { useMemo, useState } from "react";
import type { ShopProduct } from "@/lib/shop-products";

export type CartLine = { product: ShopProduct; quantity: number };

export function useCart() {
  const [lines, setLines] = useState<CartLine[]>([]);

  const add = (product: ShopProduct) =>
    setLines((prev) => {
      if (!prev.some((line) => line.product.id === product.id)) {
        return [...prev, { product, quantity: 1 }];
      }
      return prev.map((line) =>
        line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line,
      );
    });

  const setQuantity = (id: string, quantity: number) =>
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((line) => line.product.id !== id)
        : prev.map((line) => (line.product.id === id ? { ...line, quantity } : line)),
    );

  const itemCount = useMemo(() => lines.reduce((sum, line) => sum + line.quantity, 0), [lines]);
  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity * line.product.price, 0),
    [lines],
  );

  return { lines, add, setQuantity, itemCount, subtotal };
}
