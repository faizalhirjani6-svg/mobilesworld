import { describe, expect, it } from 'vitest';
import { visualPolicy } from './visual-policy';
describe('Lightweight visuals', () => {
  it('uses simpler non-interactive animation on phones', () => {
    expect(visualPolicy(360, false)).toEqual({ mobile: true, dpr: 1, animate: true, speed: 0.35, interactive: false });
  });
  it('disables motion and interaction when reduced motion is requested', () => {
    expect(visualPolicy(1280, true).animate).toBe(false);
    expect(visualPolicy(1280, true).interactive).toBe(false);
  });
});