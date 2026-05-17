import OpenAI from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { buildReflectionPrompt } from "@/lib/ai/prompt";
import { reflectionSchema } from "@/lib/ai/reflection-schema";
import { createClient } from "@/lib/supabase/server";

const inputSchema = z.object({
  eventText: z.string().min(10),
  emotionTags: z.array(z.string()).default([]),
  emotionIntensity: z.number().int().min(1).max(10),
  relatedPerson: z.string().optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "需要先登录后再调用 AI 觉察。" }, { status: 401 });
  }

  const parsedInput = inputSchema.safeParse(await request.json());
  if (!parsedInput.success) {
    return NextResponse.json({ error: "请输入更具体的事件。" }, { status: 400 });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: "你只返回可以被 JSON.parse 解析的 JSON 对象。",
      },
      {
        role: "user",
        content: buildReflectionPrompt(parsedInput.data),
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message.content;
  if (!content) {
    return NextResponse.json({ error: "AI 暂时没有返回内容。" }, { status: 502 });
  }

  const parsedOutput = reflectionSchema.safeParse(JSON.parse(content));
  if (!parsedOutput.success) {
    return NextResponse.json({ error: "AI 返回格式不完整，请稍后重试。" }, { status: 502 });
  }

  return NextResponse.json(parsedOutput.data);
}
