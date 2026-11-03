import { afterEach, describe, expect, it, vi } from "vitest";
import { reportLovableError } from "@/lib/lovable-error-reporting";

afterEach(() => {
  delete window.__lovableEvents;
  delete window.__lovableReportRuntimeError;
});

describe("Error telemetry privacy", () => {
  it("never forwards original errors, causes, stacks, or arbitrary context", () => {
    const capture = vi.fn();
    const report = vi.fn();
    window.__lovableEvents = { captureException: capture };
    window.__lovableReportRuntimeError = report;
    const marker = "synthetic-sensitive-test-data";
    reportLovableError(new Error(marker, { cause: new Error(marker) }), { token: marker });
    expect(capture).toHaveBeenCalledOnce();
    expect(report).toHaveBeenCalledOnce();
    const forwarded = capture.mock.calls[0]?.[0];
    expect(forwarded?.message).not.toContain(marker);
    expect(JSON.stringify(capture.mock.calls)).not.toContain(marker);
    expect(JSON.stringify(report.mock.calls)).not.toContain(marker);
    expect(report.mock.calls[0]?.[0]).not.toHaveProperty("stack");
  });
});