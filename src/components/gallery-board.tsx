"use client";

import { CalendarDays, Sparkles } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ReflectionRecord } from "@/lib/records/types";
import { cn } from "@/lib/utils";

export function GalleryBoard({ records }: { records: ReflectionRecord[] }) {
  const [selectedId, setSelectedId] = useState(records[0]?.id);
  const selected = records.find((record) => record.id === selectedId) || records[0];

  if (!selected) return null;

  return (
    <section className="mt-10 grid gap-6 lg:grid-cols-[0.98fr_1.02fr]">
      <Card className="sticky top-28 min-h-[620px] overflow-hidden p-7 sm:p-8 lg:self-start">
        <div className="absolute inset-x-0 top-0 h-44 bg-[linear-gradient(135deg,rgba(123,146,127,0.22),rgba(198,147,106,0.14),transparent)]" />
        <div className="relative">
          <Badge variant="warm">当前展开</Badge>
          <time className="font-sans-soft mt-8 inline-flex items-center gap-2 text-sm text-muted">
            <CalendarDays className="size-4" />
            {new Date(selected.created_at).toLocaleDateString("zh-CN")}
          </time>
          <h2 className="text-balance mt-5 text-4xl font-semibold leading-tight text-ink">{selected.title}</h2>
          <p className="mt-5 leading-8 text-muted">{selected.summary}</p>

          <section className="mt-7 rounded-[26px] border border-line/70 bg-paper/74 p-5">
            <p className="font-sans-soft text-xs font-semibold uppercase tracking-[0.22em] text-sage">当时记录</p>
            <p className="mt-3 leading-8 text-ink">{selected.event_text}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {selected.emotion_tags.map((tag) => (
                <span className="font-sans-soft rounded-full bg-sage/12 px-3 py-1 text-xs font-medium text-moss" key={tag}>
                  {tag}
                </span>
              ))}
              <span className="font-sans-soft rounded-full bg-gold/14 px-3 py-1 text-xs font-medium text-[#7b6330]">
                强度 {selected.emotion_intensity}/10
              </span>
              {selected.related_person ? (
                <span className="font-sans-soft rounded-full bg-clay/12 px-3 py-1 text-xs font-medium text-clay">
                  {selected.related_person}
                </span>
              ) : null}
            </div>
          </section>

          <section className="mt-4 grid gap-4 sm:grid-cols-2">
            <MemoryDetail title="深层原因">{selected.emotional_root}</MemoryDetail>
            <MemoryDetail title="模式线索">{selected.pattern}</MemoryDetail>
          </section>

          <blockquote className="mt-4 rounded-[26px] border border-gold/30 bg-gold/10 p-5 leading-8 text-[#6f5930]">
            <Sparkles className="mb-3 size-4" />
            {selected.future_self_note}
          </blockquote>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {records.map((record, index) => (
          <MemoryButton
            active={record.id === selected.id}
            index={index}
            key={record.id}
            onSelect={() => setSelectedId(record.id)}
            record={record}
          />
        ))}
      </div>
    </section>
  );
}

function MemoryDetail({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <article className="rounded-[22px] border border-line/70 bg-white/60 p-4">
      <h3 className="font-sans-soft text-xs font-semibold uppercase tracking-[0.2em] text-sage">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-muted">{children}</p>
    </article>
  );
}

function MemoryButton({
  active,
  index,
  onSelect,
  record,
}: {
  active: boolean;
  index: number;
  onSelect: () => void;
  record: ReflectionRecord;
}) {
  const tones = [
    "bg-[linear-gradient(135deg,rgba(123,146,127,0.14),rgba(255,255,255,0.42))]",
    "bg-[linear-gradient(135deg,rgba(181,150,88,0.14),rgba(255,255,255,0.42))]",
    "bg-[linear-gradient(135deg,rgba(198,147,106,0.12),rgba(255,255,255,0.44))]",
    "bg-[linear-gradient(135deg,rgba(123,146,127,0.10),rgba(181,150,88,0.12))]",
  ];

  return (
    <button
      className={cn(
        "group rounded-[28px] border p-5 text-left shadow-sm transition hover:-translate-y-1 hover:bg-paper hover:shadow-xl hover:shadow-sage/10",
        active ? "border-moss bg-paper ring-4 ring-sage/10" : "border-line/70 bg-white/58",
      )}
      onClick={onSelect}
      type="button"
    >
      <div className={`mb-5 h-28 rounded-[24px] border border-line/60 ${tones[index % tones.length]} p-4`}>
        <div className="flex h-full flex-col justify-between">
          <time className="font-sans-soft text-xs text-muted">
            {new Date(record.created_at).toLocaleDateString("zh-CN")}
          </time>
          <div className="h-px w-full bg-line/80" />
        </div>
      </div>
      <span className="line-clamp-2 text-xl font-semibold leading-snug text-ink">{record.title}</span>
      <span className="mt-3 block line-clamp-3 text-sm leading-6 text-muted">{record.summary}</span>
      <span className="mt-5 flex flex-wrap gap-2">
        {record.emotion_tags.slice(0, 3).map((tag) => (
          <span className="font-sans-soft rounded-full bg-white px-2.5 py-1 text-xs text-muted" key={tag}>
            {tag}
          </span>
        ))}
      </span>
    </button>
  );
}
