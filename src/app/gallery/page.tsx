import { ArrowRight, GalleryVerticalEnd, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, SoftPanel } from "@/components/ui/card";
import { GalleryBoard } from "@/components/gallery-board";
import type { ReflectionRecord } from "@/lib/records/types";
import { isE2EMode } from "@/lib/e2e/mock-reflection";
import { getE2ERecords } from "@/lib/e2e/store";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export default async function GalleryPage() {
  if (isE2EMode()) {
    return <Gallery records={getE2ERecords()} />;
  }

  if (!isSupabaseConfigured()) {
    return <SetupRequired title="记忆画廊" />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <LoginRequired title="记忆画廊" />;
  }

  const { data: records } = await supabase
    .from("reflection_records")
    .select("*")
    .order("created_at", { ascending: false });

  const list = (records || []) as ReflectionRecord[];

  return <Gallery records={list} />;
}

function Gallery({ records }: { records: ReflectionRecord[] }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
        <div>
          <Badge>Time Gallery</Badge>
          <h1 className="text-balance mt-5 max-w-3xl text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            记忆画廊
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            把完成过的觉察封存成一件件可以回看的作品。它们不是流水账，而是未来某个时刻提醒你：我曾经怎样穿过这里。
          </p>
        </div>

        <SoftPanel className="relative overflow-hidden p-6">
          <div className="absolute right-6 top-6 h-24 w-24 rounded-full bg-gold/18 blur-2xl" />
          <div className="relative flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-moss text-white shadow-lg shadow-moss/20">
              <GalleryVerticalEnd className="size-5" />
            </span>
            <div>
              <p className="font-sans-soft text-sm font-medium text-muted">今日馆藏</p>
              <p className="mt-2 text-3xl font-semibold text-ink">{records.length}</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                每条记录都只属于你。未来版本可以继续加入提醒、分享卡片和时间胶囊。
              </p>
            </div>
          </div>
        </SoftPanel>
      </section>

      {records.length === 0 ? <EmptyGallery /> : <GalleryBoard records={records} />}
    </main>
  );
}

function EmptyGallery() {
  return (
    <section className="mt-10 overflow-hidden rounded-[34px] border border-dashed border-line bg-white/52 p-8 sm:p-10">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <span className="grid size-14 place-items-center rounded-2xl bg-sage/12 text-moss">
            <LockKeyhole className="size-6" />
          </span>
          <h2 className="mt-6 text-3xl font-semibold text-ink">还没有封存的感悟</h2>
          <p className="mt-4 max-w-xl leading-8 text-muted">
            从一次 AI 觉察开始。写下今天发生的事，保存后这里会生成第一件属于你的“情绪藏品”。
          </p>
          <ButtonLink className="mt-7" href="/reflect">
            去写第一条记录
            <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {["事件", "情绪", "给未来的我"].map((label, index) => (
            <div
              className="rounded-[26px] border border-line/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.58),rgba(238,232,220,0.62))] p-5"
              key={label}
            >
              <p className="font-sans-soft text-xs text-muted">0{index + 1}</p>
              <p className="mt-8 text-lg font-semibold text-ink">{label}</p>
              <div className="mt-4 h-1 rounded-full bg-sage/20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LoginRequired({ title }: { title: string }) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <Card className="p-8 sm:p-10">
        <Badge>Private Space</Badge>
        <h1 className="mt-5 text-4xl font-semibold text-ink">{title}</h1>
        <p className="mt-4 leading-8 text-muted">这里保存的是你的私密内容，请先登录后再进入记忆画廊。</p>
        <ButtonLink className="mt-7" href="/auth">
          登录 / 注册
          <ArrowRight className="size-4" />
        </ButtonLink>
      </Card>
    </main>
  );
}

function SetupRequired({ title }: { title: string }) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <Card className="p-8 sm:p-10">
        <Badge variant="warm">Setup</Badge>
        <h1 className="mt-5 text-4xl font-semibold text-ink">{title}</h1>
        <p className="mt-4 leading-8 text-muted">
          还没有配置 Supabase 环境变量。请根据 <code>.env.example</code> 补齐本地环境后重启服务。
        </p>
      </Card>
    </main>
  );
}
