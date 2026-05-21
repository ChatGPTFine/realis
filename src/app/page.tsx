import {
  ArrowRight,
  BookOpen,
  CircleDotDashed,
  Clock3,
  Compass,
  Music2,
  PenLine,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, SoftPanel } from "@/components/ui/card";
import { getLocaleFromSearchParam, t } from "@/lib/i18n";

const valueCards = [
  {
    icon: PenLine,
    title: "写下一个具体片刻",
    body: "不用完整复盘人生，只从今天最刺痛的一刻开始。事件越具体，觉察越能落地。",
  },
  {
    icon: CircleDotDashed,
    title: "看见深层原因",
    body: "AI 将情绪、需要、荣格功能线索与关系触发点整理成一封可以慢慢读的解读信。",
  },
  {
    icon: Clock3,
    title: "封存为可回看的作品",
    body: "每次觉察都会沉淀成一张记忆作品，未来再打开时，能重新接住当时的自己。",
  },
];

const prescriptions = [
  { icon: BookOpen, label: "书籍", text: "读一段能替你说出委屈的文字" },
  { icon: Music2, label: "音乐", text: "给紧绷的身体一个降速的入口" },
  { icon: Compass, label: "行动", text: "做一件十分钟内可以完成的小事" },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const locale = getLocaleFromSearchParam(params.lang);

  return (
    <main className="overflow-hidden">
      <section className="relative mx-auto grid min-h-[calc(100vh-72px)] w-full max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:py-20">
        <div className="absolute left-1/2 top-10 -z-10 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(181,150,88,0.18),transparent_68%)]" />

        <div>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Badge className="border-gold/30 bg-gold/10 text-[#7b6330]">
              <Sparkles className="mr-1 size-3.5" />
              Realis / 返照
            </Badge>
            <ButtonLink className="min-h-8 px-3 py-1 text-xs" href={t(locale, "home.langHref")} variant="ghost">
              {t(locale, "home.langTarget")}
            </ButtonLink>
          </div>

          <h1 className="text-balance max-w-4xl text-5xl font-semibold leading-[1.08] text-ink sm:text-6xl lg:text-7xl">
            {t(locale, "home.title")}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-9 text-muted sm:text-xl">{t(locale, "home.body")}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/reflect">
              开始一次返照
              <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/gallery" variant="secondary">
              预览记忆画廊
            </ButtonLink>
          </div>

          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {["私密保存", "AI 解读信", "关系罗盘"].map((item) => (
              <div className="font-sans-soft rounded-2xl border border-line/70 bg-white/44 px-4 py-3 text-sm text-muted" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>

        <Card className="animate-float-letter relative overflow-hidden p-6 sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(181,150,88,0.24),transparent_36%)]" />
          <div className="relative rounded-[26px] border border-line/70 bg-paper/80 p-6 shadow-inner">
            <p className="font-sans-soft text-xs font-semibold uppercase tracking-[0.34em] text-sage">Reflection Letter</p>
            <h2 className="mt-5 text-4xl font-semibold leading-tight text-ink">会议里被跳过的方案</h2>
            <p className="mt-5 border-l-2 border-gold/60 pl-5 leading-8 text-muted">
              刺痛你的不只是方案没有被采用，而是你很努力地准备，却没有被认真看见。这里面有一部分
              Te 的效率焦虑，也有 Fi 对真实贡献被忽略的难过。
            </p>

            <div className="mt-7 grid gap-3">
              {prescriptions.map((item) => {
                const Icon = item.icon;
                return (
                  <SoftPanel className="flex items-center gap-4 p-4" key={item.label}>
                    <span className="grid size-11 place-items-center rounded-2xl bg-sage/12 text-moss">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{item.label}</p>
                      <p className="font-sans-soft mt-1 text-sm text-muted">{item.text}</p>
                    </div>
                  </SoftPanel>
                );
              })}
            </div>
          </div>
        </Card>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          {valueCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card className="p-6" key={card.title}>
                <span className="grid size-12 place-items-center rounded-2xl bg-gold/15 text-[#7b6330]">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-6 text-2xl font-semibold text-ink">{card.title}</h3>
                <p className="mt-3 leading-7 text-muted">{card.body}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:pb-28">
        <Card className="grid gap-8 overflow-hidden p-6 lg:grid-cols-[0.8fr_1.2fr] lg:p-8">
          <div>
            <Badge>流程预览</Badge>
            <h2 className="mt-5 text-4xl font-semibold leading-tight">从事件到处方，再到未来回看。</h2>
            <p className="mt-4 leading-8 text-muted">
              Realis 不急着给建议。它先陪你把身体感受、情绪根源、荣格功能倾向与关系触发点慢慢照亮。
            </p>
          </div>
          <div className="grid gap-3">
            {["记录事件与情绪", "生成 AI 解读信", "保存到记忆画廊", "沉淀人际罗盘"].map((step, index) => (
              <div className="flex items-center gap-4 rounded-2xl border border-line/70 bg-white/44 p-4" key={step}>
                <span className="font-sans-soft grid size-10 place-items-center rounded-full bg-ink text-paper text-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-lg font-semibold text-ink">{step}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
}
