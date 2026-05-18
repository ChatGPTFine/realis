import Link from "next/link";
import type { ReflectionRecord } from "@/lib/records/types";
import { isE2EMode } from "@/lib/e2e/mock-reflection";
import { getE2ERecords } from "@/lib/e2e/store";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export default async function GalleryPage() {
  if (isE2EMode()) {
    return <Gallery records={getE2ERecords()} />;
  }

  if (!isSupabaseConfigured()) {
    return <SetupRequired title="时光画廊" />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <LoginRequired title="时光画廊" />;
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
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold text-[#7b927f]">Time Gallery</p>
        <h1 className="mt-2 text-4xl font-semibold">记忆画廊</h1>
        <p className="mt-4 max-w-2xl leading-7 text-[#65706d]">
          这里保存你每一次完成的私密觉察。未来的你可以按时间回看，当时那个自己真正需要什么。
        </p>
      </div>

      {records.length === 0 ? (
        <section className="rounded-lg border border-dashed border-[#d9e1dc] p-8">
          <h2 className="text-2xl font-semibold">还没有保存的记录</h2>
          <p className="mt-3 text-[#65706d]">从一次 AI 觉察开始，给未来的自己留下一盏灯。</p>
          <Link className="mt-6 inline-flex rounded-md bg-[#7b927f] px-5 py-3 font-medium text-white" href="/reflect">
            去写第一条记录
          </Link>
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {records.map((record) => (
            <article className="rounded-lg border border-[#d9e1dc] bg-white p-5 shadow-sm" key={record.id}>
              <time className="text-sm text-[#65706d]">{new Date(record.created_at).toLocaleDateString("zh-CN")}</time>
              <h2 className="mt-2 text-2xl font-semibold">{record.title}</h2>
              <p className="mt-3 leading-7 text-[#65706d]">{record.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {record.emotion_tags.map((tag) => (
                  <span className="rounded-md bg-[#eef4ef] px-2 py-1 text-xs text-[#4f6254]" key={tag}>
                    {tag}
                  </span>
                ))}
                {record.related_person ? (
                  <span className="rounded-md bg-[#eef3f7] px-2 py-1 text-xs text-[#4d6b7a]">
                    {record.related_person}
                  </span>
                ) : null}
              </div>
              <blockquote className="mt-4 rounded-md bg-[#f7faf8] p-3 text-sm leading-6 text-[#65706d]">
                {record.future_self_note}
              </blockquote>
              <button
                className="mt-4 rounded-md border border-[#d9e1dc] px-3 py-2 text-sm text-[#65706d]"
                disabled
                type="button"
              >
                生成分享卡片（后续版本）
              </button>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

function LoginRequired({ title }: { title: string }) {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold">{title}</h1>
      <p className="mt-4 leading-7 text-[#65706d]">这里保存的是你的私密内容，请先登录。</p>
      <Link className="mt-6 inline-flex rounded-md bg-[#7b927f] px-5 py-3 font-medium text-white" href="/auth">
        登录 / 注册
      </Link>
    </main>
  );
}

function SetupRequired({ title }: { title: string }) {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold">{title}</h1>
      <p className="mt-4 leading-7 text-[#65706d]">
        还没有配置 Supabase 环境变量。请复制 <code>.env.example</code> 为 <code>.env.local</code>，填入
        Supabase URL 和 Anon Key 后重启开发服务器。
      </p>
    </main>
  );
}
