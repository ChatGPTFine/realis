import {
  BookOpen,
  CheckCircle2,
  Clapperboard,
  HeartHandshake,
  Music2,
  Sparkles,
  Wand2,
} from "lucide-react";
import type { ReflectionOutput } from "@/lib/ai/reflection-schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, SoftPanel } from "@/components/ui/card";

const labels = {
  film: { label: "电影", icon: Clapperboard },
  book: { label: "书籍", icon: BookOpen },
  music: { label: "音乐", icon: Music2 },
  action: { label: "行动", icon: Wand2 },
};

export function ReflectionResult({
  reflection,
  onSave,
  saving,
  saved,
}: {
  reflection: ReflectionOutput;
  onSave?: () => void;
  saving?: boolean;
  saved?: boolean;
}) {
  const jungianInsights = reflection.compass_updates.flatMap((update) =>
    (update.jungian_functions || []).map((item) => ({
      ...item,
      person: update.nickname || update.relationship_type,
    })),
  );

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-line/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(238,232,220,0.92))] px-6 py-6">
        <Badge className="bg-gold/10 text-[#7b6330]">
          <Sparkles className="mr-1 size-3.5" />
          沉淀结果 / AI 觉察信
        </Badge>
        <h2 className="mt-4 text-4xl font-semibold leading-tight text-ink">{reflection.title}</h2>
        <p className="mt-4 border-l-2 border-gold/50 pl-5 leading-8 text-muted">{reflection.summary}</p>
      </div>

      <div className="space-y-5 p-6">
        <ResultBlock title="亲爱的你">{reflection.gentle_response}</ResultBlock>
        <div className="grid gap-4 md:grid-cols-2">
          <ResultBlock title="深层原因">{reflection.emotional_root}</ResultBlock>
          <ResultBlock title="潜在需要">{reflection.underlying_needs.join("、")}</ResultBlock>
        </div>
        <ResultBlock title="荣格功能与模式线索">{reflection.pattern}</ResultBlock>

        {jungianInsights.length > 0 ? (
          <section className="rounded-[28px] border border-line/70 bg-paper/70 p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="text-2xl font-semibold text-ink">荣格功能解读</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  这里不是人格定论，只是从这次对话里提炼出的功能线索。
                </p>
              </div>
              <Badge variant="warm">Jungian Functions</Badge>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {jungianInsights.map((item) => (
                <article className="rounded-[22px] border border-line/70 bg-white/62 p-4" key={`${item.person}-${item.code}`}>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-sans-soft text-lg font-semibold text-ink">{item.code}</span>
                    <span className="font-sans-soft rounded-full bg-sage/10 px-2.5 py-1 text-xs text-moss">
                      {item.score}/5
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted">{item.tendency}</p>
                  <p className="mt-2 text-xs leading-5 text-muted/80">{item.evidence}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section>
          <h3 className="text-2xl font-semibold text-ink">治愈处方</h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            不是命令，而是给今天的你一个可以选择的温柔方向。
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {Object.entries(reflection.prescriptions).map(([key, values]) => {
              const item = labels[key as keyof typeof labels];
              const Icon = item.icon;
              return (
                <SoftPanel className="p-4" key={key}>
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-2xl bg-moss/10 text-moss">
                      <Icon className="size-5" />
                    </span>
                    <p className="font-semibold text-ink">{item.label}</p>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
                    {values.map((value) => (
                      <li key={value}>· {value}</li>
                    ))}
                  </ul>
                </SoftPanel>
              );
            })}
          </div>
        </section>

        <blockquote className="rounded-3xl border border-gold/30 bg-gold/10 p-5 leading-8 text-[#6f5930]">
          “{reflection.future_self_note}”
        </blockquote>

        {reflection.safety_note ? (
          <p className="rounded-2xl border border-clay/30 bg-clay/10 p-4 text-sm leading-6 text-[#8a4b39]">
            {reflection.safety_note}
          </p>
        ) : null}

        {onSave ? (
          <Button className="w-full" disabled={saving || saved} onClick={onSave} type="button">
            {saved ? (
              <>
                <CheckCircle2 className="size-4" />
                已保存到时光画廊
              </>
            ) : saving ? (
              "正在封存..."
            ) : (
              <>
                <HeartHandshake className="size-4" />
                保存到时光画廊
              </>
            )}
          </Button>
        ) : null}
      </div>
    </Card>
  );
}

function ResultBlock({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <article className="rounded-3xl border border-line/70 bg-white/60 p-5">
      <h3 className="font-sans-soft text-xs font-semibold uppercase tracking-[0.22em] text-sage">{title}</h3>
      <p className="mt-3 leading-8 text-muted">{children}</p>
    </article>
  );
}
