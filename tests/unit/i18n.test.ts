import { describe, expect, it } from "vitest";
import { getLocaleFromSearchParam, t } from "@/lib/i18n";

describe("i18n", () => {
  it("defaults to Chinese for unknown locales", () => {
    expect(getLocaleFromSearchParam(null)).toBe("zh");
    expect(getLocaleFromSearchParam("fr")).toBe("zh");
  });

  it("returns English copy when locale is en", () => {
    expect(getLocaleFromSearchParam("en")).toBe("en");
    expect(t("en", "nav.reflect")).toBe("AI Reflection");
    expect(t("zh", "nav.reflect")).toBe("AI觉察");
  });
});
