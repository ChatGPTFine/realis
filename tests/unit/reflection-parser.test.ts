import { describe, expect, it } from "vitest";
import { parseReflectionContent } from "@/lib/ai/reflection-parser";

describe("parseReflectionContent", () => {
  const validReflection = {
    title: "会议里被跳过的方案",
    summary: "摘要",
    gentle_response: "回应",
    emotional_root: "根源",
    underlying_needs: ["被看见"],
    pattern: "模式",
    prescriptions: {
      film: ["电影"],
      book: ["书"],
      music: ["音乐"],
      action: ["行动"],
    },
    future_self_note: "给未来自己的话",
    compass_updates: [],
    safety_note: null,
  };

  it("parses valid JSON content", () => {
    expect(parseReflectionContent(JSON.stringify(validReflection)).title).toBe("会议里被跳过的方案");
  });

  it("parses JSON wrapped in markdown fences", () => {
    const content = `\`\`\`json\n${JSON.stringify(validReflection)}\n\`\`\``;
    expect(parseReflectionContent(content).underlying_needs).toEqual(["被看见"]);
  });

  it("throws a stable error for invalid model output", () => {
    expect(() => parseReflectionContent("not json")).toThrow("AI_RESPONSE_INVALID_JSON");
  });
});
