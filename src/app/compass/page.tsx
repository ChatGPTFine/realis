import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type PersonProfile = {
  id: string;
  relationship_type: string;
  nickname: string;
  related_record_count: number;
  common_triggers: string[];
  relationship_pattern_summary: string;
  mbti_tendency: string;
  interaction_guide: string;
};

export default async function CompassPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-semibold">人际罗盘</h1>
        <p className="mt-4 leading-7 text-[#65706d]">这里会沉淀你和重要他人的关系画像，请先登录。</p>
        <Link className="mt-6 inline-flex rounded-md bg-[#7b927f] px-5 py-3 font-medium text-white" href="/auth">
          登录 / 注册
        </Link>
      </main>
    );
  }

  const { data } = await supabase
    .from("person_profiles")
    .select("*")
    .order("updated_at", { ascending: false });

  const profiles = (data || []) as PersonProfile[];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold text-[#7b927f]">Relationship Compass</p>
        <h1 className="mt-2 text-4xl font-semibold">人际罗盘</h1>
        <p className="mt-4 max-w-2xl leading-7 text-[#65706d]">
          从你的记录里慢慢看见：哪些关系最容易触发你，你真正需要怎样被对待。
        </p>
        <p className="mt-3 rounded-md bg-[#eef4ef] p-3 text-sm text-[#4f6254]">
          MBTI 倾向仅用于自我理解，不代表诊断或固定人格。
        </p>
      </div>

      {profiles.length === 0 ? (
        <section className="rounded-lg border border-dashed border-[#d9e1dc] p-8">
          <h2 className="text-2xl font-semibold">罗盘还在等待第一条线索</h2>
          <p className="mt-3 text-[#65706d]">保存一条带有相关人物的 AI 觉察后，这里会开始生成关系画像。</p>
          <Link className="mt-6 inline-flex rounded-md bg-[#7b927f] px-5 py-3 font-medium text-white" href="/reflect">
            去完成一次觉察
          </Link>
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {profiles.map((profile) => (
            <article className="rounded-lg border border-[#d9e1dc] bg-white p-5 shadow-sm" key={profile.id}>
              <p className="text-sm text-[#65706d]">{profile.relationship_type}</p>
              <h2 className="mt-1 text-2xl font-semibold">{profile.nickname}</h2>
              <p className="mt-3 text-sm text-[#65706d]">相关记录：{profile.related_record_count}</p>
              <Section title="常见触发点">{profile.common_triggers.join("、") || "还在观察中"}</Section>
              <Section title="关系模式">{profile.relationship_pattern_summary || "还在观察中"}</Section>
              <Section title="MBTI 倾向">{profile.mbti_tendency || "还在观察中"}</Section>
              <Section title="相处指南">{profile.interaction_guide || "还在观察中"}</Section>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

function Section({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="mt-4 rounded-md bg-[#f7faf8] p-3">
      <h3 className="font-medium">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-[#65706d]">{children}</p>
    </div>
  );
}
