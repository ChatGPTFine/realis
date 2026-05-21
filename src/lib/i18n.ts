export type Locale = "zh" | "en";

const messages = {
  zh: {
    "nav.reflect": "AI觉察",
    "home.title": "写下今天发生的事，看见情绪背后的需要。",
    "home.body":
      "Realis / 返照用 AI 把具体事件整理成温柔、清晰、可回看的觉察信，并沉淀成你的私密记忆画廊和人际罗盘。",
    "home.start": "开始觉察",
    "home.auth": "登录 / 注册",
    "home.langTarget": "EN",
    "home.langHref": "/?lang=en",
  },
  en: {
    "nav.reflect": "AI Reflection",
    "home.title": "Write down what happened today and see the need beneath the emotion.",
    "home.body":
      "Realis turns concrete moments into gentle, structured AI reflection letters you can revisit in your private memory gallery and relationship compass.",
    "home.start": "Start Reflection",
    "home.auth": "Log in / Sign up",
    "home.langTarget": "中文",
    "home.langHref": "/",
  },
} satisfies Record<Locale, Record<string, string>>;

export function getLocaleFromSearchParam(value: string | null | undefined): Locale {
  return value === "en" ? "en" : "zh";
}

export function t(locale: Locale, key: keyof (typeof messages)["zh"]) {
  return messages[locale][key] ?? messages.zh[key];
}
