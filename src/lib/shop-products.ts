import ubonPowermax from "@/assets/shop/ubon-powermax.webp";
import ubonPowerSlice from "@/assets/shop/ubon-power-slice.webp";
import miPowerBank from "@/assets/shop/mi-power-bank-2i.webp";
import lapcareTrust from "@/assets/shop/lapcare-trust.webp";
import ubonFighterHp from "@/assets/shop/ubon-fighter-hp.webp";
import ubonAudioBull from "@/assets/shop/ubon-audio-bull.webp";
import ubonFighterSp from "@/assets/shop/ubon-fighter-sp.webp";
import oudRockstar from "@/assets/shop/oud-rockstar.webp";
import ubonSultaan from "@/assets/shop/ubon-sultaan.webp";
import ubonLightup from "@/assets/shop/ubon-lightup.webp";
import ubonBoom from "@/assets/shop/ubon-boom-sp44.webp";
import blueiPlasma from "@/assets/shop/bluei-plasma-rocker.webp";
import rockMusic from "@/assets/shop/rock-music-rm.webp";
import ubonMiniTone from "@/assets/shop/ubon-mini-tone.webp";
import oudChampion from "@/assets/shop/oud-champion.webp";
import jayballyExtraBass from "@/assets/shop/jaybally-extra-bass.webp";
import troopsSound from "@/assets/shop/troops-sound.webp";
import troopsNeo from "@/assets/shop/troops-neo-tp3088.webp";
import jblMiniBoost from "@/assets/shop/jbl-mini-boost.webp";
import jayballyPortable from "@/assets/shop/jaybally-portable.webp";

export type ShopProduct = {
  id: string;
  name: string;
  specs: string;
  price: number;
  image: string;
};

export const SHOP_PRODUCTS: ShopProduct[] = [
  { id: "ubon-powermax", name: "UBON PowerMax PB-X20 20000mAh", specs: "15W · Dual USB · Type-C input", price: 1700, image: ubonPowermax },
  { id: "ubon-power-slice", name: "UBON Power Slice PB-X8 10000mAh", specs: "15W fast charging · LED indicator", price: 1100, image: ubonPowerSlice },
  { id: "mi-power-bank-2i", name: "Mi Power Bank 2i 10000mAh", specs: "3.6A fast charging · Dual output", price: 800, image: miPowerBank },
  { id: "lapcare-trust", name: "Lapcare Trust I Magnetic Power Bank", specs: "22.5W wired · 15W wireless · MagSafe", price: 2000, image: lapcareTrust },
  { id: "ubon-fighter-hp", name: "UBON Fighter HP-40 Wireless Headphones", specs: "BT 5.3 · 40 hours playback · Deep bass", price: 1499, image: ubonFighterHp },
  { id: "ubon-audio-bull", name: "UBON Audio Bull 2.0 BT-5750 Headphones", specs: "Built-in mic · TF card · FM radio", price: 999, image: ubonAudioBull },
  { id: "ubon-fighter-sp", name: "UBON Fighter SP-48 Soundbar Speaker", specs: "16W · 10 hours · BT 5.3", price: 1200, image: ubonFighterSp },
  { id: "oud-rockstar", name: "OUD Rockstar Soundbar with Phone Stand", specs: "10W · BT 5.1 · Mobile holder", price: 700, image: oudRockstar },
  { id: "ubon-sultaan", name: "UBON Sultaan SP-72 Wireless Speaker", specs: "10W · RGB lights · 10 hours", price: 900, image: ubonSultaan },
  { id: "ubon-lightup", name: "UBON Lightup SP-35 Party Speaker", specs: "8W · RGB lights · Shoulder strap", price: 800, image: ubonLightup },
  { id: "ubon-boom-sp44", name: "UBON Boom Series SP-44", specs: "10W · BT 5.3 party speaker", price: 600, image: ubonBoom },
  { id: "bluei-plasma-rocker", name: "bluei Plasma Rocker-R19", specs: "Built-in torch · FM · USB", price: 600, image: blueiPlasma },
  { id: "rock-music-rm", name: "Rock Music RM-990 Outdoor Speaker", specs: "Portable outdoor · Rugged build", price: 600, image: rockMusic },
  { id: "ubon-mini-tone", name: "UBON Mini Tone SP-20 Speaker", specs: "TWS · TF card · Easy carry handle", price: 400, image: ubonMiniTone },
  { id: "oud-champion", name: "OUD Champion Mini Speaker", specs: "6.5W · FM · TWS", price: 400, image: oudChampion },
  { id: "jaybally-extra-bass", name: "Jaybally Extra-Bass Cube Speaker", specs: "USB · Micro SD · Extra bass", price: 400, image: jayballyExtraBass },
  { id: "troops-sound", name: "Troops Sound Mini Speaker", specs: "Bluetooth · Carry strap", price: 400, image: troopsSound },
  { id: "troops-neo-tp3088", name: "Troops Neo TP-3088", specs: "Radio · USB · Good sound", price: 400, image: troopsNeo },
  { id: "jbl-mini-boost", name: "JBL Mini Boost 3D Speaker", specs: "Bluetooth · 8 hours playback", price: 200, image: jblMiniBoost },
  { id: "jaybally-portable", name: "Jaybally Portable Mini Speaker", specs: "Compact metal body · Bluetooth", price: 300, image: jayballyPortable },
];

export function formatPrice(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}
