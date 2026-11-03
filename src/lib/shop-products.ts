export type ShopProduct = {
  id: string;
  name: string;
  price: number;
};

export const SHOP_PRODUCTS: ShopProduct[] = [
  { id: "aurora-buds", name: "Aurora Buds", price: 1299 },
  { id: "vortex-pro-headset", name: "Vortex Pro Headset", price: 2499 },
  { id: "lumen-power-bank", name: "Lumen Power Bank", price: 1849 },
  { id: "pulse-wired-earphones", name: "Pulse Wired Earphones", price: 399 },
  { id: "orbit-neckband", name: "Orbit Neckband", price: 899 },
  { id: "drift-speaker-mini", name: "Drift Speaker Mini", price: 1599 },
  { id: "nova-fast-charger", name: "Nova Fast Charger", price: 749 },
  { id: "echo-smart-watch", name: "Echo Smart Watch", price: 3299 },
];

export function formatPrice(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}
