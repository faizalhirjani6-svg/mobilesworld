export function visualPolicy(width: number, reducedMotion: boolean) {
  const mobile = width < 768;
  return { mobile, dpr: mobile ? 1 : 1.5, animate: !reducedMotion, speed: mobile ? 0.35 : 0.6, interactive: !mobile && !reducedMotion };
}