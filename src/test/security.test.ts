import { describe, expect, it } from "vitest";
import { inspectText } from "../../scripts/security-check.mjs";

describe("Credential build guard", () => {
  it("rejects a private key in public content", () => {
    expect(inspectText("-----BEGIN " + "PRIVATE KEY-----", { publicFile: true })).not.toHaveLength(0);
  });
  it("rejects browser-exposed API key variables", () => {
    expect(inspectText("import.meta.env.VITE_PROVIDER_API_KEY", { frontend: true })).not.toHaveLength(0);
  });
  it("rejects server environment access in browser code", () => {
    expect(inspectText("process.env['PROVIDER_API_KEY']", { frontend: true })).not.toHaveLength(0);
  });
  it("allows an environment read within a server-only handler", () => {
    expect(inspectText("process.env['PROVIDER_API_KEY']")).toHaveLength(0);
  });
  it("detects a synthetic provider credential without logging it", () => {
    expect(inspectText("ghp_" + "a".repeat(36))).not.toHaveLength(0);
  });
});