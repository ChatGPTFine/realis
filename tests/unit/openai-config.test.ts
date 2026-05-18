import { describe, expect, it } from "vitest";
import { getOpenAIClientOptions } from "@/lib/ai/openai-config";

describe("getOpenAIClientOptions", () => {
  it("includes baseURL when OPENAI_BASE_URL is configured", () => {
    const options = getOpenAIClientOptions({
      OPENAI_API_KEY: "test-key",
      OPENAI_BASE_URL: "https://api.deepseek.com",
    });

    expect(options).toEqual({
      apiKey: "test-key",
      baseURL: "https://api.deepseek.com",
    });
  });

  it("omits baseURL when it is not configured", () => {
    const options = getOpenAIClientOptions({
      OPENAI_API_KEY: "test-key",
    });

    expect(options).toEqual({
      apiKey: "test-key",
    });
  });
});
