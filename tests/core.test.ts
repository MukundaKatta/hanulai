import { describe, it, expect } from "vitest";
import { Hanulai } from "../src/core.js";
describe("Hanulai", () => {
  it("init", () => { expect(new Hanulai().getStats().ops).toBe(0); });
  it("op", async () => { const c = new Hanulai(); await c.process(); expect(c.getStats().ops).toBe(1); });
  it("reset", async () => { const c = new Hanulai(); await c.process(); c.reset(); expect(c.getStats().ops).toBe(0); });
});
