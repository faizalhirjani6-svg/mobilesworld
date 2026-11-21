import ubonPowermax from "@/assets/products/ubon-powermax-20000.jpg";
import ubonPowerSlice from "@/assets/products/ubon-power-slice-10000.jpg";
import miPowerBank from "@/assets/products/mi-power-bank-2i.jpg";
import lapcareTrust from "@/assets/products/lapcare-trust-1.jpg";
import boatRockerz from "@/assets/products/boat-rockerz-550.jpg";
import ubonFighter from "@/assets/products/ubon-fighter-hp730.jpg";
import ubonAudioBull from "@/assets/products/ubon-audio-bull-2.jpg";
import jayballySpeaker from "@/assets/products/jaybally-speaker.jpg";
import troopsSoundSquare from "@/assets/products/troops-sound-square.jpg";

export type ShopProduct = {
  id: string;
  name: string;
  price: number;
  image?: string;
  detail?: string;
};

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: "ubon-powermax-pb-sx204",
    name: "UBON PowerMax PB-SX204 20000mAh",
    detail: "15W · Dual USB · Smart IC",
    price: 1299,
    image: ubonPowermax,
  },
  {
    id: "ubon-power-slice-pb-x88-pro",
    name: "UBON Power Slice PB-X88 Pro 10000mAh",
    detail: "15W fast charging · LED indicator",
    price: 899,
    image: ubonPowerSlice,
  },
  {
    id: "mi-power-bank-2i-20000",
    name: "Mi Power Bank 2i 20000mAh",
    detail: "3.6A fast charging · Two-way",
    price: 1999,
    image: miPowerBank,
  },
  {
    id: "lapcare-trust-1-magsafe",
    name: "Lapcare Trust I MagSafe 10000mAh",
    detail: "22.5W wired · 15W wireless",
    price: 2499,
    image: lapcareTrust,
  },
  {
    id: "boat-rockerz-550",
    name: "boAt Rockerz 550 Headphones",
    detail: "Hands-free calls · Long battery",
    price: 1799,
    image: boatRockerz,
  },
  {
    id: "ubon-fighter-hp-730",
    name: "UBON Fighter HP-730 Headphones",
    detail: "BT 5.3 · 40 hours playtime",
    price: 1499,
    image: ubonFighter,
  },
  {
    id: "ubon-audio-bull-bt-5680",
    name: "UBON Audio Bull 2.0 BT-5680",
    detail: "Built-in mic · TF card · AUX",
    price: 999,
    image: ubonAudioBull,
  },
  {
    id: "jaybally-portable-speaker",
    name: "Jaybally Portable Wireless Speaker",
    detail: "Compact metal body · Bluetooth",
    price: 599,
    image: jayballySpeaker,
  },
  {
    id: "troops-sound-square-tp-3090",
    name: "Troops Sound Square TP-3090",
    detail: "Bluetooth · Lightweight · HD sound",
    price: 799,
    image: troopsSoundSquare,
  },
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
