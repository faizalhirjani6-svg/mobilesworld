import ubonPowermax from "@/assets/products/ubon-powermax-20000.png";
import ubonPowerSlice from "@/assets/products/ubon-power-slice-10000.png";
import miPowerBank from "@/assets/products/mi-power-bank-2i.png";
import lapcareTrust from "@/assets/products/lapcare-trust-1.png";
import ubonFighter from "@/assets/products/ubon-fighter-hp730.png";
import ubonAudioBull from "@/assets/products/ubon-audio-bull-2.png";
import jayballySpeaker from "@/assets/products/jaybally-speaker.png";
import jayballyExtraBass from "@/assets/products/jaybally-extra-bass-tws.png";
import troopsSoundSquare from "@/assets/products/troops-sound-square.png";
import troopsNeo from "@/assets/products/troops-neo-tp3088.png";
import ubonLightup from "@/assets/products/ubon-lightup-sp43.png";
import ubonSultaan from "@/assets/products/ubon-sultaan-sp47.png";
import ubonBoom from "@/assets/products/ubon-boom-sp44.png";
import ubonMiniTone from "@/assets/products/ubon-mini-tone-sp8090.png";
import blueiPlasma from "@/assets/products/bluei-plasma-r19.png";
import rockMusic from "@/assets/products/rock-music-bt556fm.png";
import jblMiniBoost from "@/assets/products/jbl-mini-boost-3d.png";
import oudChampion from "@/assets/products/oud-champion.png";
import oudRockstar from "@/assets/products/oud-rockstar.png";
import ubonFighterSoundbar from "@/assets/products/ubon-fighter-sp250.png";

export type ShopProduct = {
  id: string;
  name: string;
  price: number;
  image?: string;
  detail?: string;
};

export const SHOP_PRODUCTS: ShopProduct[] = [
  { id: "ubon-powermax-pb-sx204", name: "UBON PowerMax PB-SX204 20000mAh", detail: "15W · Dual USB · Smart IC", price: 1299, image: ubonPowermax },
  { id: "ubon-power-slice-pb-x88-pro", name: "UBON Power Slice PB-X88 Pro 10000mAh", detail: "15W fast charging · LED indicator", price: 899, image: ubonPowerSlice },
  { id: "mi-power-bank-2i-20000", name: "Mi Power Bank 2i 20000mAh", detail: "3.6A fast charging · Two-way", price: 1999, image: miPowerBank },
  { id: "lapcare-trust-1-magsafe", name: "Lapcare Trust I MagSafe 10000mAh", detail: "22.5W wired · 15W wireless", price: 2499, image: lapcareTrust },
  { id: "ubon-fighter-hp-730", name: "UBON Fighter HP-730 Headphones", detail: "BT 5.3 · 40 hours playtime", price: 1499, image: ubonFighter },
  { id: "ubon-audio-bull-bt-5680", name: "UBON Audio Bull 2.0 BT-5680", detail: "Built-in mic · TF card · AUX", price: 999, image: ubonAudioBull },
  { id: "ubon-fighter-sp-250", name: "UBON Fighter SP-250 Soundbar", detail: "16W · 10 hours · Mobile stand", price: 1999, image: ubonFighterSoundbar },
  { id: "oud-rockstar-soundbar", name: "OUD Rockstar Home TV Soundbar", detail: "10W · BT 5.1 · Mobile stand", price: 1499, image: oudRockstar },
  { id: "ubon-sultaan-sp-47", name: "UBON Sultaan SP-47 Gold", detail: "10W · RGB lights · 10 hours", price: 1599, image: ubonSultaan },
  { id: "ubon-lightup-sp-43", name: "UBON Lightup SP-43", detail: "8W · RGB lights · Hanging belt", price: 1299, image: ubonLightup },
  { id: "ubon-boom-sp-44", name: "UBON Boom Series SP-44", detail: "10W · BT 5.3 party speaker", price: 1199, image: ubonBoom },
  { id: "bluei-plasma-rocker-r19", name: "bluei Plasma Rocker-R19", detail: "Built-in torch · FM · TWS", price: 1399, image: blueiPlasma },
  { id: "rock-music-rm-bt556fm", name: "Rock Music RM-BT556FM", detail: "Portable outdoor · HiFi sound", price: 1199, image: rockMusic },
  { id: "ubon-mini-tone-sp-8090", name: "UBON Mini Tone SP-8090", detail: "TWS · TF card · Easy to carry", price: 799, image: ubonMiniTone },
  { id: "oud-champion-speaker", name: "OUD Champion Wireless Speaker", detail: "6.5W · FM · TWS", price: 799, image: oudChampion },
  { id: "jaybally-extra-bass-tws", name: "Jaybally Extra-Bass TWS Speaker", detail: "USB · Micro SD · Mobile stand", price: 699, image: jayballyExtraBass },
  { id: "troops-sound-square-tp-3090", name: "Troops Sound Square TP-3090", detail: "Bluetooth · Lightweight · HD sound", price: 799, image: troopsSoundSquare },
  { id: "troops-neo-tp-3088", name: "Troops Neo TP-3088", detail: "Radio · USB · Good battery", price: 699, image: troopsNeo },
  { id: "jbl-mini-boost-3d", name: "JBL Mini Boost 3D Metal Speaker", detail: "Bluetooth · 8 hours playtime", price: 499, image: jblMiniBoost },
  { id: "jaybally-portable-speaker", name: "Jaybally Portable Wireless Speaker", detail: "Compact metal body · Bluetooth", price: 599, image: jayballySpeaker },
];

export function formatPrice(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}
