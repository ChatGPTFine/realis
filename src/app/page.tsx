import Link from "next/link";
import { getLocaleFromSearchParam, t } from "@/lib/i18n";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const locale = getLocaleFromSearchParam(params.lang);

  return (
    <main>
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <div className="mb-4 flex items-center gap-4">
            <p className="text-sm font-semibold text-[#7b927f]">Realis</p>
            <Link className="rounded-md border border-[#d9e1dc] bg-white px-3 py-1 text-sm" href={t(locale, "home.langHref")}>
              {t(locale, "home.langTarget")}
            </Link>
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-tight">{t(locale, "home.title")}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#65706d]">{t(locale, "home.body")}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link className="rounded-md bg-[#7b927f] px-5 py-3 font-medium text-white" href="/reflect">
              {t(locale, "home.start")}
            </Link>
            <Link className="rounded-md border border-[#d9e1dc] bg-white px-5 py-3 font-medium text-[#24302f]" href="/auth">
              {t(locale, "home.auth")}
            </Link>
          </div>
          <p className="mt-6 max-w-xl text-sm leading-6 text-[#65706d]">
            AI 觉察不是医学诊断，也不能替代心理治疗；它是一盏帮助你整理当下经验的小灯。
          </p>
        </div>
        <div className="rounded-lg border border-[#d9e1dc] bg-white p-5 shadow-sm">
          <div className="rounded-md bg-[#eef4ef] p-5">
            <p className="text-sm font-medium text-[#7b927f]">今天的记录</p>
            <p className="mt-4 text-2xl font-semibold">会议里，我的方案被很快跳过了。</p>
            <p className="mt-4 leading-7 text-[#65706d]">
              也许刺痛你的不只是方案没被采用，而是你希望自己的准备被认真看见。
            </p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {["情绪根源", "潜在需求", "疗愈处方", "未来回看"].map((item) => (
              <div className="rounded-md border border-[#d9e1dc] p-4 text-sm text-[#65706d]" key={item}>
                <span className="font-medium text-[#24302f]">{item}</span>
                <br />
                私密保存，慢慢回看。
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
