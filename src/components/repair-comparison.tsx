import { useState } from 'react';
import { ChevronsLeftRight } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
function PhoneDrawing({ broken = false }: { broken?: boolean }) {
  return <svg viewBox="0 0 640 420" className="comparison-art" role="img" aria-label={broken ? 'Illustration of a cracked phone screen' : 'Illustration of a repaired phone screen'}>
    <ellipse cx="320" cy="385" rx="108" ry="10" className="comparison-shadow" />
    <rect x="223" y="26" width="194" height="354" rx="28" className="comparison-frame" />
    <rect x="232" y="35" width="176" height="336" rx="21" className="comparison-screen" />
    <path d="M250 290L392 115M250 330L392 155" className="comparison-stripe" />
    <rect x="294" y="44" width="52" height="13" rx="7" className="comparison-island" />
    <text x="320" y="200" textAnchor="middle" className="comparison-logo">MW</text>
    <text x="320" y="227" textAnchor="middle" className="comparison-word">MOBILE WORLD</text>
    {broken && <g className="comparison-cracks"><path d="M239 95L310 165L290 230L363 300L402 350M310 165L382 130L401 71M310 165L252 182L235 240M290 230L252 299L239 350M363 300L397 257M382 130L348 70M310 165L348 192L390 185" /><path d="M239 95L282 120L310 165L335 110M290 230L344 254L363 300M252 299L290 320" /></g>}
  </svg>;
}
export function RepairComparison() {
  const [position, setPosition] = useState(50);
  return <section id="our-work" className="mx-auto max-w-6xl px-5 py-24">
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm uppercase text-primary">Our work</p><h2 className="mt-3 text-4xl font-black sm:text-6xl">A fresh start.</h2></div><p className="text-sm text-muted-foreground">Illustrated screen repair · not a customer repair photo</p></div>
    <div className="comparison-stage">
      <PhoneDrawing />
      <div className="comparison-before" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}><PhoneDrawing broken /></div>
      <span className="comparison-label comparison-label-before">Before</span><span className="comparison-label comparison-label-after">After</span>
      <div className="comparison-divider" style={{ left: `${position}%` }}><ChevronsLeftRight aria-hidden /></div>
      <Slider className="comparison-control" min={0} max={100} step={1} value={[position]} onValueChange={([value]) => setPosition(value ?? 50)} aria-label="Before and after repair comparison" />
    </div>
    <div className="mt-5 flex justify-between text-sm text-muted-foreground"><span>Cracked glass</span><span className="text-primary">Clear display</span></div>
  </section>;
}