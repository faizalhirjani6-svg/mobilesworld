import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LogoSlamIntro } from "@/components/logo-slam-intro";

const complete = vi.hoisted(() => vi.fn());
vi.mock("@/components/site", () => ({ signalIntroComplete: complete }));

beforeEach(() => { sessionStorage.clear(); complete.mockClear(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("logo opening playback", () => {
  it("plays only once per browser session", () => {
    const first = render(<LogoSlamIntro />);
    expect(sessionStorage.getItem("mw-logo-slam-played")).toBe("1");
    expect(complete).not.toHaveBeenCalled();
    first.unmount();
    const second = render(<LogoSlamIntro />);
    expect(second.container.childElementCount).toBe(0);
    expect(complete).toHaveBeenCalledOnce();
  });

  it("skips playback when reduced motion is requested", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true } as MediaQueryList);
    const opening = render(<LogoSlamIntro />);
    expect(opening.container.childElementCount).toBe(0);
    expect(sessionStorage.getItem("mw-logo-slam-played")).toBeNull();
    expect(complete).toHaveBeenCalledOnce();
  });
});