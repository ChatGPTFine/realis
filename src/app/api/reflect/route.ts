import OpenAI from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { buildReflectionPrompt } from "@/lib/ai/prompt";
import { getOpenAIClientOptions } from "@/lib/ai/openai-config";
import { parseReflectionContent } from "@/lib/ai/reflection-parser";
import { getMockReflection, isE2EMode } from "@/lib/e2e/mock-reflection";
import { createClient } from "@/lib/supabase/server";

const inputSchema = z.object({
  eventText: z.string().min(10),
  emotionTags: z.array(z.string()).default([]),
  emotionIntensity: z.number().int().min(1).max(10),
  relatedPerson: z.string().optional(),
});

function jsonError(message: string, status: number, detail?: string) {
  return NextResponse.json({ error: message, detail }, { status });
}

export async function POST(request: Request) {
  if (isE2EMode()) {
    return NextResponse.json(getMockReflection());
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return jsonError("需要先登录后再调用 AI 觉察。", 401);
  }

  const parsedInput = inputSchema.safeParse(await request.json());
  if (!parsedInput.success) {
    return jsonError("请输入更具体的事件。", 400);
  }

  try {
    const openai = new OpenAI(getOpenAIClientOptions(process.env));
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "你只返回可以被 JSON.parse 解析的 JSON 对象，不要输出 Markdown。",
        },
        {
          role: "user",
          content: buildReflectionPrompt(parsedInput.data),
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 1800,
    });

    const content = completion.choices[0]?.message.content;
    if (!content) {
      return jsonError("AI 暂时没有返回内容，请稍后重试。", 502, "AI_RESPONSE_EMPTY");
    }

    return NextResponse.json(parseReflectionContent(content));
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "AI_RESPONSE_INVALID_JSON" || error.message === "AI_RESPONSE_SCHEMA_MISMATCH") {
        return jsonError("AI 返回格式不完整，请稍后重试。", 502, error.message);
      }

      const maybeStatus = "status" in error && typeof error.status === "number" ? error.status : undefined;
      if (maybeStatus === 401) {
        return jsonError("AI 服务认证失败，请检查 API Key 和服务商配置。", 502, "AI_AUTH_FAILED");
      }
      if (maybeStatus === 404) {
        return jsonError("AI 模型不存在或当前账号不可用，请检查 OPENAI_MODEL。", 502, "AI_MODEL_NOT_FOUND");
      }
      if (maybeStatus === 429) {
        return jsonError("AI 服务请求过于频繁或额度不足，请稍后再试。", 502, "AI_RATE_LIMITED");
      }

      return jsonError("AI 服务暂时不可用，请稍后重试。", 502, error.message);
    }

    return jsonError("AI 服务暂时不可用，请稍后重试。", 502);
  }
}
