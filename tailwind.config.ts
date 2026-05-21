import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        porcelain: "var(--porcelain)",
        paper: "var(--paper)",
        mist: "var(--mist)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        line: "var(--line)",
        sage: "var(--sage)",
        moss: "var(--moss)",
        clay: "var(--clay)",
        gold: "var(--gold)",
        night: "var(--night)",
      },
    },
  },
  plugins: [],
};

export default config;
