import { useRef, useCallback, type CSSProperties } from "react";

export function useTilt(max = 12) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rx = -((e.clientY - cy) / (rect.height / 2)) * max;
      const ry = ((e.clientX - cx) / (rect.width / 2)) * max;
      el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04)`;
    },
    [max],
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)";
  }, []);

  return { ref, onMove, onLeave, style: { transformStyle: "preserve-3d" } as CSSProperties };
}
