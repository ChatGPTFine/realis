import { describe, expect, it } from "vitest";
import { buildReflectionPrompt } from "@/lib/ai/prompt";

describe("buildReflectionPrompt", () => {
  it("includes the user's event, context, and strict JSON contract", () => {
    const prompt = buildReflectionPrompt({
      eventText: "今天会议里，我准备很久的方案被很快跳过了。",
      emotionTags: ["委屈", "失落"],
      emotionIntensity: 7,
      relatedPerson: "同事",
    });

    expect(prompt).toContain("你是 Realis 的 AI 觉察助手");
    expect(prompt).toContain("今天会议里，我准备很久的方案被很快跳过了。");
    expect(prompt).toContain("委屈、失落");
    expect(prompt).toContain("7/10");
    expect(prompt).toContain("同事");
    expect(prompt).toContain("严格 JSON");
    expect(prompt).toContain("prescriptions");
    expect(prompt).toContain("safety_note");
  });
});
