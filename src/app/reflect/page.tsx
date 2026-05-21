"use client";

import { Loader2, MailOpen, MessageCircle, Moon, Send, ShieldCheck, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import type { ReflectionOutput } from "@/lib/ai/reflection-schema";
import { ReflectionResult } from "@/components/reflection-result";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, SoftPanel } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const emotionOptions = ["委屈", "焦虑", "愤怒", "失落", "羞耻", "孤独", "疲惫", "不安"];

export default function ReflectPage() {
  const [eventText, setEventText] = useState("");
  const [relatedPerson, setRelatedPerson] = useState("");
  const [emotionIntensity, setEmotionIntensity] = useState(5);
  const [emotionTags, setEmotionTags] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reflection, setReflection] = useState<ReflectionOutput | null>(null);
  const [started, setStarted] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [finalLoading, setFinalLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const payload = useMemo(
    () => ({ eventText, emotionTags, emotionIntensity, relatedPerson, conversationMessages: messages }),
    [emotionIntensity, emotionTags, eventText, messages, relatedPerson],
  );

  async function startReflection() {
    setStarted(true);
    await sendChatMessage(eventText.trim());
  }

  async function sendChatMessage(overrideText?: string) {
    const userText = chatInput.trim() || eventText.trim();
    const nextUserText = overrideText || userText;
    if (nextUserText.length < 10) return;

    setError("");
    setSaved(false);
    setReflection(null);
    setChatInput("");
    setChatLoading(true);

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: nextUserText }];
    setMessages(nextMessages);

    const response = await fetch("/api/reflect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, mode: "chat", conversationMessages: nextMessages }),
    });

    const data = await response.json();
    setChatLoading(false);

    if (!response.ok) {
      setError(data.error || "AI 暂时没有回应，请稍后重试。");
      return;
    }

    setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
  }

  async function generateReflection() {
    setError("");
    setSaved(false);
    setFinalLoading(true);

    const response = await fetch("/api/reflect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, mode: "final" }),
    });

    const data = await response.json();
    setFinalLoading(false);

    if (!response.ok) {
      setError(data.error || "生成失败，请稍后重试。");
      return;
    }

    setReflection(data);
  }

  async function saveRecord() {
    if (!reflection) return;
    setSaving(true);
    setError("");

    const response = await fetch("/api/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, reflection }),
    });

    setSaving(false);
    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "保存失败，请稍后重试。");
      return;
    }
    setSaved(true);
  }

  function toggleEmotion(emotion: string) {
    setEmotionTags((current) =>
      current.includes(emotion) ? current.filter((item) => item !== emotion) : [...current, emotion],
    );
  }

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:py-12">
      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>
            <Moon className="mr-1 size-3.5" />
            AI觉察
          </Badge>
          <Badge className="bg-moss/10 text-moss">先讨论，再沉淀成信</Badge>
        </div>
        <h1 className="mt-5 text-4xl font-semibold leading-tight text-ink">
          先和 AI 慢慢聊，再生成一封觉察信。
        </h1>
        <p className="mt-4 leading-8 text-muted">
          记录今天发生的事，选择情绪与相关人物。AI 会先陪你追问关键片刻，最后再整理深层原因、荣格功能线索和治愈处方。
        </p>

        <div className="mt-7 space-y-5">
          <div>
            <label className="font-sans-soft text-sm font-semibold text-muted" htmlFor="event">
              具体事件
            </label>
            <Textarea
              className="mt-2 min-h-52"
              id="event"
              onChange={(event) => setEventText(event.target.value)}
              placeholder="例如：今天会议里，我准备很久的方案被很快跳过了..."
              value={eventText}
            />
          </div>

          <div>
            <p className="font-sans-soft text-sm font-semibold text-muted">情绪标签</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {emotionOptions.map((emotion) => (
                <button
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition",
                    emotionTags.includes(emotion)
                      ? "border-sage bg-sage/12 text-ink shadow-sm"
                      : "border-line bg-white/54 text-muted hover:bg-white",
                  )}
                  key={emotion}
                  onClick={() => toggleEmotion(emotion)}
                  type="button"
                >
                  {emotion}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
            <div>
              <label className="font-sans-soft text-sm font-semibold text-muted" htmlFor="person">
                相关人物
              </label>
              <Input
                className="mt-2"
                id="person"
                onChange={(event) => setRelatedPerson(event.target.value)}
                placeholder="自己 / 父亲 / 同事 / 伴侣..."
                value={relatedPerson}
              />
            </div>
            <div>
              <label className="font-sans-soft text-sm font-semibold text-muted" htmlFor="intensity">
                情绪强度：{emotionIntensity}/10
              </label>
              <input
                className="mt-5 w-full accent-[#778a70]"
                id="intensity"
                max={10}
                min={1}
                onChange={(event) => setEmotionIntensity(Number(event.target.value))}
                type="range"
                value={emotionIntensity}
              />
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-clay/30 bg-clay/10 p-4 text-sm leading-6 text-[#8a4b39]">
              {error}
            </div>
          ) : null}

          <p className="flex gap-2 rounded-2xl bg-white/54 p-4 text-sm leading-6 text-muted">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-sage" />
            AI 觉察不是医学诊断，也不能替代心理治疗。如果你处于急性危机中，请优先联系可信任的人或当地紧急服务。
          </p>

          <Button
            className="w-full"
            disabled={chatLoading || eventText.trim().length < 10}
            onClick={startReflection}
            type="button"
          >
            {chatLoading && !started ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            开始觉察
          </Button>
        </div>
      </Card>

      <section className="space-y-5">
        {reflection ? (
          <ReflectionResult onSave={saveRecord} reflection={reflection} saved={saved} saving={saving} />
        ) : !started ? (
          <Card className="flex min-h-[520px] items-center justify-center overflow-hidden p-8">
            <div className="max-w-md text-center">
              <Badge className="bg-gold/10 text-[#7b6330]">
                <MessageCircle className="mr-1 size-3.5" />
                深度交流
              </Badge>
              <h2 className="mt-5 text-4xl font-semibold leading-tight text-ink">先在左侧完成一次觉察启动。</h2>
              <p className="mt-4 leading-8 text-muted">
                点击“开始觉察”后，AI 会在这里接住你的第一段记录，并带你继续往深处看。
              </p>
            </div>
          </Card>
        ) : (
        <Card className="h-[calc(100vh-120px)] min-h-[620px] max-h-[760px] overflow-hidden">
          <div className="border-b border-line/70 bg-paper/82 px-5 py-4">
            <Badge className="bg-gold/10 text-[#7b6330]">
              <MessageCircle className="mr-1 size-3.5" />
              对话式觉察
            </Badge>
          </div>
          <div className="flex h-[calc(100%-61px)] flex-col p-5">
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
              {messages.length === 0 ? (
                <SoftPanel className="p-6">
                  <MailOpen className="size-6 text-moss" />
                  <h2 className="mt-4 text-2xl font-semibold text-ink">从一句话开始也可以。</h2>
                  <p className="mt-3 leading-7 text-muted">
                    你可以先发送事件本身，AI 会继续问一个轻量的问题，帮你靠近那个真正被触动的地方。
                  </p>
                </SoftPanel>
              ) : (
                messages.map((message, index) => (
                  <div
                    className={cn(
                      "max-w-[88%] rounded-[24px] px-5 py-4 text-sm leading-7",
                      message.role === "user"
                        ? "ml-auto bg-night text-paper"
                        : "mr-auto border border-line/70 bg-paper/80 text-muted",
                    )}
                    key={`${message.role}-${index}`}
                  >
                    {message.content}
                  </div>
                ))
              )}
              {chatLoading ? (
                <div className="mr-auto inline-flex items-center gap-2 rounded-full border border-line bg-paper/80 px-4 py-2 text-sm text-muted">
                  <Loader2 className="size-4 animate-spin" />
                  AI 正在回应...
                </div>
              ) : null}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
              <Input
                aria-label="继续对 AI 说"
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="补充一个细节，或直接发送上面的事件..."
                value={chatInput}
              />
              <Button disabled={chatLoading || eventText.trim().length < 10} onClick={() => sendChatMessage()} type="button">
                {chatLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                发送给 AI
              </Button>
            </div>

            {messages.some((message) => message.role === "assistant") ? (
              <Button
                className="mt-3 w-full"
                disabled={finalLoading || eventText.trim().length < 10}
                onClick={generateReflection}
                type="button"
                variant="secondary"
              >
                {finalLoading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                沉淀为结果
              </Button>
            ) : null}
          </div>
        </Card>
        )}
      </section>
    </main>
  );
}
