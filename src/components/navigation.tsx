import { Compass, GalleryVerticalEnd, PenLine, Sparkles } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

const links = [
  { href: "/", label: "首页" },
  { href: "/reflect", label: "AI觉察", icon: PenLine },
  { href: "/gallery", label: "记忆画廊", icon: GalleryVerticalEnd },
  { href: "/compass", label: "人际罗盘", icon: Compass },
];

export function Navigation() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-porcelain/78 backdrop-blur-2xl">
      <nav className="mx-auto flex min-h-[72px] w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link className="group inline-flex items-center gap-3" href="/">
          <span className="grid size-10 place-items-center rounded-2xl bg-night text-paper shadow-[0_14px_34px_rgba(24,35,31,0.18)] transition group-hover:-rotate-3">
            返
          </span>
          <span>
            <span className="block text-base font-semibold tracking-wide text-ink">Realis</span>
            <span className="font-sans-soft block text-xs tracking-[0.28em] text-muted">返照</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-line/70 bg-white/48 p-1 shadow-sm md:flex">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                className="font-sans-soft inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted transition hover:bg-paper hover:text-ink"
                href={link.href}
                key={link.href}
              >
                {Icon ? <Icon className="size-4" /> : null}
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            aria-label="Change language"
            className="font-sans-soft hidden text-sm text-muted hover:text-ink sm:inline"
            href="/?lang=en"
          >
            EN
          </Link>
          <ButtonLink className="min-h-10 px-4" href="/auth" variant="secondary">
            <Sparkles className="size-4" />
            登录
          </ButtonLink>
        </div>
      </nav>

      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3 sm:px-6 md:hidden">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              className="font-sans-soft inline-flex shrink-0 items-center gap-2 rounded-full border border-line/70 bg-white/48 px-3 py-2 text-xs text-muted"
              href={link.href}
              key={link.href}
            >
              {Icon ? <Icon className="size-3.5" /> : null}
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
