"use client";

import { CheckCircle2, Fingerprint, Layers3, Loader2, PencilLine, ScrollText, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, SoftPanel } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { JungianFunctionInsight } from "@/lib/records/types";
import { cn } from "@/lib/utils";

export type RelationshipProfile = {
  id: string;
  relationship_type: string;
  nickname: string;
  related_record_count: number;
  common_triggers: string[];
  relationship_pattern_summary: string;
  mbti_tendency: string;
  jungian_functions?: JungianFunctionInsight[];
  closeness_score?: number;
  interaction_guide: string;
};

export type RelationshipEvent = {
  id: string;
  title: string;
  event_text: string;
  summary: string;
  related_person: string | null;
  emotion_tags: string[];
  created_at: string;
  compass_updates: Array<{
    relationship_type: string;
    nickname: string;
  }>;
};

type RelationshipBoardProps = {
  profiles: RelationshipProfile[];
  events: RelationshipEvent[];
};

export function RelationshipBoard({ events, profiles }: RelationshipBoardProps) {
  const [selectedId, setSelectedId] = useState(profiles[0]?.id);
  const [localProfiles, setLocalProfiles] = useState(profiles);
  const relationshipProfiles = useMemo(() => localProfiles.filter((profile) => !isSelfProfile(profile)), [localProfiles]);
  const selected = relationshipProfiles.find((profile) => profile.id === selectedId) || relationshipProfiles[0];

  const relatedEvents = useMemo(() => {
    if (!selected) return [];
    return events.filter((event) => {
      const plainMatch =
        event.related_person === selected.nickname ||
        event.related_person === selected.relationship_type ||
        selected.nickname.includes(event.related_person || "__missing__");
      const compassMatch = event.compass_updates.some(
        (update) =>
          update.nickname === selected.nickname ||
          update.relationship_type === selected.relationship_type,
      );
      return plainMatch || compassMatch;
    });
  }, [events, selected]);

  const selfSummary = useMemo(() => buildSelfSummary(events, localProfiles), [events, localProfiles]);

  function updateMbti(id: string, mbti: string) {
    setLocalProfiles((current) =>
      current.map((profile) => (profile.id === id ? { ...profile, mbti_tendency: mbti } : profile)),
    );
  }

  return (
    <section className="mt-10 space-y-6">
      <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(238,232,220,0.62),rgba(229,236,225,0.55))] p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge>People Index</Badge>
            <h2 className="mt-4 text-3xl font-semibold text-ink">我的关系网</h2>
          </div>
          <p className="max-w-lg text-sm leading-6 text-muted">从自我状态出发，整理重要关系里的触发、需要与相处方式。</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SelfCard summary={selfSummary} />
          {relationshipProfiles.map((profile) => {
            const tone = getRelationshipTone(profile.relationship_type);
            return (
            <button
              className={cn(
                "group relative overflow-hidden rounded-[26px] border p-4 text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sage/10",
                profile.id === selected.id
                  ? `${tone.active} ring-4 ring-sage/10`
                  : `${tone.border} ${tone.bg}`,
              )}
              key={profile.id}
              onClick={() => setSelectedId(profile.id)}
              type="button"
            >
              <div
                className={cn(
                  "absolute right-4 top-4 size-12 rounded-full opacity-60 blur-sm transition group-hover:scale-125",
                  tone.glow,
                )}
              />
              <div className="relative">
                <span className={cn("font-sans-soft inline-flex rounded-full px-3 py-1 text-xs", tone.pill)}>
                  {profile.relationship_type}
                </span>
                <p className="font-sans-soft mt-8 min-h-5 text-sm font-semibold text-moss">
                  {profile.mbti_tendency}
                </p>
              </div>
            </button>
            );
          })}
        </div>
      </Card>

      {selected ? (
        <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
          <PersonDetail
            events={relatedEvents}
            onMbtiSaved={(mbti) => updateMbti(selected.id, mbti)}
            profile={selected}
          />
          <RelationshipArchive events={relatedEvents} profile={selected} />
        </div>
      ) : null}
    </section>
  );
}

function SelfCard({ summary }: { summary: ReturnType<typeof buildSelfSummary> }) {
  return (
    <article className="relative overflow-hidden rounded-[26px] border border-night/15 bg-[linear-gradient(135deg,#273631,#3f4f43)] p-4 text-paper shadow-[0_18px_50px_rgba(24,35,31,0.18)]">
      <div className="absolute right-3 top-3 size-16 rounded-full bg-white/10 blur-sm" />
      <div className="relative">
        <span className="font-sans-soft inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-paper/80">
          <UserRound className="size-3.5" />
          自我
        </span>
        <p className="mt-8 text-lg font-semibold">{summary.primaryNeed}</p>
        <p className="font-sans-soft mt-2 text-xs leading-5 text-paper/70">{summary.emotionLine}</p>
      </div>
    </article>
  );
}

function isSelfProfile(profile: RelationshipProfile) {
  const label = `${profile.relationship_type}${profile.nickname}`.toLowerCase();
  return /自我|自己|本人|me|self/.test(label);
}

function getRelationshipTone(relationshipType: string) {
  if (/朋友|友人|闺蜜|兄弟/.test(relationshipType)) {
    return {
      active: "border-sage bg-[linear-gradient(135deg,rgba(229,236,225,0.95),rgba(255,255,255,0.68))]",
      bg: "border-sage/25 bg-[linear-gradient(135deg,rgba(229,236,225,0.72),rgba(255,255,255,0.58))]",
      border: "border-sage/25",
      glow: "bg-sage/35",
      pill: "bg-white/64 text-moss",
    };
  }

  if (/同事|工作|上司|下属|客户/.test(relationshipType)) {
    return {
      active: "border-[#b59658] bg-[linear-gradient(135deg,rgba(181,150,88,0.20),rgba(255,255,255,0.72))]",
      bg: "border-gold/25 bg-[linear-gradient(135deg,rgba(181,150,88,0.13),rgba(255,255,255,0.62))]",
      border: "border-gold/25",
      glow: "bg-gold/32",
      pill: "bg-white/66 text-[#7b6330]",
    };
  }

  if (/伴侣|恋人|夫妻|爱人/.test(relationshipType)) {
    return {
      active: "border-clay bg-[linear-gradient(135deg,rgba(198,147,106,0.20),rgba(255,255,255,0.72))]",
      bg: "border-clay/25 bg-[linear-gradient(135deg,rgba(198,147,106,0.13),rgba(255,255,255,0.62))]",
      border: "border-clay/25",
      glow: "bg-clay/30",
      pill: "bg-white/66 text-clay",
    };
  }

  if (/父|母|家人|亲人|孩子|姐妹|兄弟/.test(relationshipType)) {
    return {
      active: "border-[#7f8f74] bg-[linear-gradient(135deg,rgba(214,222,205,0.78),rgba(255,255,255,0.68))]",
      bg: "border-[#7f8f74]/25 bg-[linear-gradient(135deg,rgba(214,222,205,0.56),rgba(255,255,255,0.60))]",
      border: "border-[#7f8f74]/25",
      glow: "bg-[#7f8f74]/28",
      pill: "bg-white/66 text-[#596951]",
    };
  }

  return {
    active: "border-moss bg-paper",
    bg: "border-line/70 bg-white/58",
    border: "border-line/70",
    glow: "bg-sage/25",
    pill: "bg-white/70 text-muted",
  };
}

function PersonDetail({
  events,
  onMbtiSaved,
  profile,
}: {
  events: RelationshipEvent[];
  onMbtiSaved: (mbti: string) => void;
  profile: RelationshipProfile;
}) {
  const [mbti, setMbti] = useState(profile.mbti_tendency || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const functions = profile.jungian_functions || [];

  useEffect(() => {
    setMbti(profile.mbti_tendency || "");
    setSaved(false);
  }, [profile.id]);

  async function saveMbti() {
    setSaving(true);
    setSaved(false);
    const response = await fetch("/api/person-profiles", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: profile.id, mbti_tendency: mbti }),
    });
    setSaving(false);

    if (response.ok) {
      onMbtiSaved(mbti);
      setSaved(true);
    }
  }

  return (
    <Card className="p-6 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant="warm">{profile.relationship_type}</Badge>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-ink">{profile.nickname}</h2>
        </div>
        <span className="font-sans-soft rounded-full border border-line bg-paper px-3 py-1 text-xs text-muted">关系画像</span>
      </div>

      <section className="mt-7 rounded-[26px] border border-line/70 bg-paper/70 p-4">
        <label className="font-sans-soft flex items-center gap-2 text-sm font-medium text-moss" htmlFor="mbti">
          <PencilLine className="size-3.5" />
          MBTI 手填
        </label>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
          <Input
            id="mbti"
            onChange={(event) => {
              setMbti(event.target.value);
              setSaved(false);
            }}
            placeholder="例如 INFJ / ENTP / 暂不确定"
            value={mbti}
          />
          <Button onClick={saveMbti} type="button" variant="secondary">
            {saving ? <Loader2 className="size-4 animate-spin" /> : saved ? <CheckCircle2 className="size-4" /> : null}
            {saved ? "已保存" : "保存 MBTI"}
          </Button>
        </div>
      </section>

      <div className="mt-4 grid gap-4">
        <InsightBlock icon={Fingerprint} title="常见触发点">
          {profile.common_triggers.length > 0 ? profile.common_triggers.join(" / ") : "还在观察中"}
        </InsightBlock>
        <InsightBlock icon={Layers3} title="关系模式">
          {profile.relationship_pattern_summary || "还在观察中"}
        </InsightBlock>
      </div>

      <section className="mt-4 rounded-[26px] border border-line/70 bg-paper/70 p-4">
        <h3 className="font-sans-soft text-sm font-medium text-moss">荣格八维</h3>
        <div className="mt-4 grid gap-3">
          {(functions.length > 0 ? functions : inferJungianFunctions(profile, events)).map((item) => (
              <div className="rounded-2xl bg-white/60 p-3" key={`${item.code}-${item.tendency}`}>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-sans-soft text-sm font-semibold text-ink">{item.code}</span>
                  <span className="font-sans-soft text-xs text-muted">{item.score}/5</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{item.tendency}</p>
                <p className="mt-1 text-xs leading-5 text-muted/80">{item.evidence}</p>
              </div>
            ))}
        </div>
      </section>

      <InsightBlock className="mt-4" icon={ScrollText} title="下一次可以这样沟通">
        {profile.interaction_guide || "还在观察中"}
      </InsightBlock>
    </Card>
  );
}

function RelationshipArchive({
  events,
  profile,
}: {
  events: RelationshipEvent[];
  profile: RelationshipProfile;
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-line/70 bg-paper/80 px-6 py-5">
        <Badge>Shared Moments</Badge>
        <h3 className="mt-3 text-3xl font-semibold text-ink">与我发生过的事</h3>
        <p className="mt-2 text-sm leading-6 text-muted">从具体事件里整理这段关系反复出现的触发、反应与需要。</p>
      </div>

      <div className="grid gap-4 p-5 sm:p-6">
        {events.length > 0 ? (
          events.slice(0, 5).map((event) => (
            <article className="rounded-[26px] border border-line/70 bg-white/58 p-5" key={event.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h4 className="max-w-xl text-xl font-semibold leading-snug text-ink">{event.title}</h4>
                <time className="font-sans-soft text-xs text-muted">
                  {new Date(event.created_at).toLocaleDateString("zh-CN")}
                </time>
              </div>
              <p className="mt-3 leading-7 text-muted">{event.event_text}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {event.emotion_tags.map((tag) => (
                  <span className="font-sans-soft rounded-full bg-sage/10 px-2.5 py-1 text-xs text-moss" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))
        ) : (
          <SoftPanel className="p-6">
            <p className="text-sm leading-7 text-muted">还没有可关联的具体事件。</p>
          </SoftPanel>
        )}
      </div>
    </Card>
  );
}

function buildSelfSummary(events: RelationshipEvent[], profiles: RelationshipProfile[]) {
  const emotionCounts = new Map<string, number>();
  for (const event of events) {
    for (const tag of event.emotion_tags) {
      emotionCounts.set(tag, (emotionCounts.get(tag) || 0) + 1);
    }
  }

  const primaryEmotion = [...emotionCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "观察中";
  const activeRelationships = profiles.length || 0;

  return {
    emotionLine: activeRelationships > 0 ? `${activeRelationships} 段关系正在形成画像` : "关系线索正在积累",
    primaryNeed: primaryEmotion === "观察中" ? "自我观察" : `${primaryEmotion}背后的需要`,
  };
}

function inferJungianFunctions(profile: RelationshipProfile, events: RelationshipEvent[]): JungianFunctionInsight[] {
  const text = `${profile.mbti_tendency} ${profile.relationship_pattern_summary} ${profile.common_triggers.join(" ")} ${events
    .map((event) => `${event.title} ${event.event_text} ${event.emotion_tags.join(" ")}`)
    .join(" ")}`;

  if (/T|Te|效率|结果|方案|工作|会议|推进/.test(text)) {
    return [
      {
        code: "Te",
        tendency: "更容易被效率、结果与外部评价牵动",
        evidence: "近期事件里出现了任务推进、贡献是否被看见等线索",
        score: 3,
      },
      {
        code: "Fi",
        tendency: "对真实感、尊重感和个人价值较敏感",
        evidence: "触发点集中在被忽略、被理解不足或表达受阻",
        score: 3,
      },
    ];
  }

  if (/F|Fi|Fe|关系|回应|照顾|冲突|委屈|失落/.test(text)) {
    return [
      {
        code: "Fi",
        tendency: "会优先感知内在价值是否被尊重",
        evidence: "记录里更常出现委屈、失落或被看见的需要",
        score: 3,
      },
      {
        code: "Fe",
        tendency: "容易捕捉关系氛围与他人的反应",
        evidence: "关系模式中出现了互动节奏、回应方式与情绪承接",
        score: 3,
      },
    ];
  }

  return [
    {
      code: "Ni",
      tendency: "倾向从事件背后寻找长期模式",
      evidence: "当前资料较少，先以关系模式和反复触发点作为轻量推测",
      score: 2,
    },
    {
      code: "Si",
      tendency: "会从既往经验里判断这段关系是否安全",
      evidence: "事件记录会逐渐沉淀出熟悉的反应路径",
      score: 2,
    },
  ];
}

function InsightBlock({
  children,
  className = "",
  icon: Icon,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  icon: typeof Fingerprint;
  title: string;
}) {
  return (
    <section className={`rounded-[26px] border border-line/70 bg-paper/70 p-4 ${className}`}>
      <h3 className="font-sans-soft flex items-center gap-2 text-sm font-medium text-moss">
        <Icon className="size-3.5" />
        {title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-muted">{children}</p>
    </section>
  );
}
