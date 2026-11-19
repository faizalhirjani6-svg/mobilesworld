import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { visualPolicy } from '@/lib/visual-policy';
const Scene = lazy(() => import('./product-scene'));
class VisualBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  override render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
export function LazyProductVisual({ kind, className = '' }: { kind: 'phone' | 'repair' | 'headphones'; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [policy, setPolicy] = useState<ReturnType<typeof visualPolicy> | null>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const update = () => { setPolicy(visualPolicy(window.innerWidth, reduced.matches)); setActive(visible && !document.hidden); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? false; update(); });
    observer.observe(node);
    window.addEventListener('resize', update);
    document.addEventListener('visibilitychange', update);
    reduced.addEventListener('change', update);
    return () => { observer.disconnect(); window.removeEventListener('resize', update); document.removeEventListener('visibilitychange', update); reduced.removeEventListener('change', update); };
  }, []);
  const fallback = <div className="visual-fallback" aria-hidden>{kind === 'headphones' ? '◖ MW ◗' : 'MW'}</div>;
  return <div ref={ref} data-product-kind={kind} className={`product-visual ${className}`} aria-hidden={kind === 'phone'} role={kind === 'phone' ? undefined : 'img'} aria-label={kind === 'repair' ? 'Illustrated phone layers separating and rejoining' : kind === 'headphones' ? 'Illustrative three-dimensional headphones' : undefined}>
    <VisualBoundary fallback={fallback}><Suspense fallback={fallback}>{active && policy ? <Scene kind={kind} policy={policy} /> : fallback}</Suspense></VisualBoundary>
  </div>;
}