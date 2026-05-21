import { describe, expect, it } from "vitest";
import { getMockReflection } from "@/lib/e2e/mock-reflection";

describe("getMockReflection", () => {
  it("returns deterministic structured reflection data without external APIs", () => {
    const result = getMockReflection();

    expect(result.title).toBeTruthy();
    expect(result.prescriptions.film.length).toBeGreaterThan(0);
    expect(result.prescriptions.book.length).toBeGreaterThan(0);
    expect(result.prescriptions.music.length).toBeGreaterThan(0);
    expect(result.prescriptions.action.length).toBeGreaterThan(0);
    expect(result.compass_updates[0].nickname).toBeTruthy();
    expect(result.compass_updates[0].closeness_score).toBeGreaterThan(0);
    expect(result.compass_updates[0].jungian_functions[0].code).toBe("Fi");
  });
});
