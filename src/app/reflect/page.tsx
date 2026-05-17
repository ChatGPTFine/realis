"use client";

import { useMemo, useState } from "react";
import type { ReflectionOutput } from "@/lib/ai/reflection-schema";
import { ReflectionResult } from "@/components/reflection-result";

const emotionOptions = ["委屈", "焦虑", "愤怒", "失落", "羞耻", "孤独", "疲惫", "不安"];

export default function ReflectPage() {
  const [eventText, setEventText] = useState("");
  const [relatedPerson, setRelatedPerson] = useState("");
  const [emotionIntensity, setEmotionIntensity] = useState(5);
  const [emotionTags, setEmotionTags] = useState<string[]>([]);
  const [reflection, setReflection] = useState<ReflectionOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const payload = useMemo(
    () => ({ eventText, emotionTags, emotionIntensity, relatedPerson }),
    [emotionIntensity, emotionTags, eventText, relatedPerson],
  );

  async function submitReflection() {
    setError("");
    setSaved(false);
    setLoading(true);

    const response = await fetch("/api/reflect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    setLoading(false);

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
    <main className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-lg border border-[#d9e1dc] bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-[#7b927f]">AI 觉察</p>
        <h1 className="mt-2 text-4xl font-semibold">今天发生了什么？</h1>
        <p className="mt-4 leading-7 text-[#65706d]">
          请写一件具体的事。越具体，AI 越能帮你看见情绪背后的需要。提交前需要登录。
        </p>

        <label className="mt-6 block text-sm font-medium text-[#65706d]" htmlFor="event">
          具体事件
        </label>
        <textarea
          className="mt-2 min-h-56 w-full resize-y rounded-md border border-[#d9e1dc] p-4 leading-7 outline-none focus:border-[#7b927f]"
          id="event"
          onChange={(event) => setEventText(event.target.value)}
          placeholder="例如：今天会议里，我准备很久的方案被很快跳过了..."
          value={eventText}
        />

        <label className="mt-5 block text-sm font-medium text-[#65706d]">情绪标签</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {emotionOptions.map((emotion) => (
            <button
              className={`rounded-md border px-3 py-2 text-sm ${
                emotionTags.includes(emotion)
                  ? "border-[#7b927f] bg-[#eef4ef] text-[#24302f]"
                  : "border-[#d9e1dc] text-[#65706d]"
              }`}
              key={emotion}
              onClick={() => toggleEmotion(emotion)}
              type="button"
            >
              {emotion}
            </button>
          ))}
        </div>

        <label className="mt-5 block text-sm font-medium text-[#65706d]" htmlFor="person">
          相关人物
        </label>
        <input
          className="mt-2 w-full rounded-md border border-[#d9e1dc] px-3 py-3 outline-none focus:border-[#7b927f]"
          id="person"
          onChange={(event) => setRelatedPerson(event.target.value)}
          placeholder="自己 / 父亲 / 同事 / 伴侣..."
          value={relatedPerson}
        />

        <label className="mt-5 block text-sm font-medium text-[#65706d]" htmlFor="intensity">
          情绪强度：{emotionIntensity}/10
        </label>
        <input
          className="mt-2 w-full"
          id="intensity"
          max={10}
          min={1}
          onChange={(event) => setEmotionIntensity(Number(event.target.value))}
          type="range"
          value={emotionIntensity}
        />

        {error ? <p className="mt-4 rounded-md bg-[#fff7f3] p-3 text-sm text-[#8a4b39]">{error}</p> : null}

        <button
          className="mt-6 w-full rounded-md bg-[#7b927f] px-5 py-3 font-medium text-white disabled:opacity-60"
          disabled={loading || eventText.trim().length < 10}
          onClick={submitReflection}
          type="button"
        >
          {loading ? "正在生成觉察..." : "生成 AI 觉察"}
        </button>
        <p className="mt-4 text-sm leading-6 text-[#65706d]">
          AI 觉察不是医学诊断，也不能替代心理治疗。如果你处于急性危机中，请优先联系身边可信任的人或当地紧急服务。
        </p>
      </section>

      {reflection ? (
        <ReflectionResult onSave={saveRecord} reflection={reflection} saved={saved} saving={saving} />
      ) : (
        <section className="rounded-lg border border-dashed border-[#d9e1dc] p-6 text-[#65706d]">
          <h2 className="text-2xl font-semibold text-[#24302f]">觉察结果会出现在这里</h2>
          <p className="mt-3 leading-7">
            它会先接住你的情绪，再帮你拆解根源、需求、模式和下一步照顾自己的方式。
          </p>
        </section>
      )}
    </main>
  );
}
