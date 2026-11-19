import { useRef, type ReactNode } from 'react';
export function ProductTilt({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return <div ref={ref} className={`product-tilt ${className}`} onPointerMove={event => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--tilt-x', `${(0.5 - (event.clientY - r.top) / r.height) * 8}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${((event.clientX - r.left) / r.width - 0.5) * 8}deg`);
  }} onPointerLeave={() => { ref.current?.style.setProperty('--tilt-x', '0deg'); ref.current?.style.setProperty('--tilt-y', '0deg'); }}>{children}</div>;
}