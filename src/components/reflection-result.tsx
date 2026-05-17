import type { ReflectionOutput } from "@/lib/ai/reflection-schema";

const labels = {
  film: "电影",
  book: "书籍",
  music: "音乐",
  action: "行动",
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
  return (
    <section className="rounded-lg border border-[#d9e1dc] bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-[#7b927f]">AI 觉察报告</p>
      <h2 className="mt-2 text-3xl font-semibold">{reflection.title}</h2>
      <p className="mt-3 leading-7 text-[#65706d]">{reflection.summary}</p>

      <div className="mt-6 grid gap-4">
        <ResultBlock title="先接住你">{reflection.gentle_response}</ResultBlock>
        <ResultBlock title="情绪根源">{reflection.emotional_root}</ResultBlock>
        <ResultBlock title="潜在需求">{reflection.underlying_needs.join("、")}</ResultBlock>
        <ResultBlock title="可能的模式">{reflection.pattern}</ResultBlock>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold">多维疗愈处方</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {Object.entries(reflection.prescriptions).map(([key, values]) => (
            <div className="rounded-md border border-[#d9e1dc] p-4" key={key}>
              <p className="font-medium">{labels[key as keyof typeof labels]}</p>
              <ul className="mt-2 list-inside list-disc text-sm leading-7 text-[#65706d]">
                {values.map((value) => (
                  <li key={value}>{value}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <blockquote className="mt-6 rounded-md bg-[#eef4ef] p-4 leading-7 text-[#4f6254]">
        {reflection.future_self_note}
      </blockquote>

      {reflection.safety_note ? (
        <p className="mt-4 rounded-md border border-[#e6d2c8] bg-[#fff7f3] p-3 text-sm text-[#8a4b39]">
          {reflection.safety_note}
        </p>
      ) : null}

      {onSave ? (
        <button
          className="mt-6 rounded-md bg-[#7b927f] px-5 py-3 font-medium text-white disabled:opacity-60"
          disabled={saving || saved}
          onClick={onSave}
          type="button"
        >
          {saved ? "已保存到时光画廊" : saving ? "正在保存..." : "保存到时光画廊"}
        </button>
      ) : null}
    </section>
  );
}

function ResultBlock({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <article className="rounded-md border border-[#d9e1dc] p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 leading-7 text-[#65706d]">{children}</p>
    </article>
  );
}
