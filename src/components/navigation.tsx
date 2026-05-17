import Link from "next/link";

const links = [
  { href: "/", label: "首页" },
  { href: "/reflect", label: "AI觉察" },
  { href: "/gallery", label: "时光画廊" },
  { href: "/compass", label: "人际罗盘" },
];

export function Navigation() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#d9e1dc] bg-[#f7faf8]/90 backdrop-blur">
      <nav className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link className="font-semibold text-[#24302f]" href="/">
          Realis
        </Link>
        <div className="flex items-center gap-2 text-sm text-[#65706d]">
          {links.map((link) => (
            <Link className="rounded-md px-3 py-2 hover:bg-white" href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
          <Link className="rounded-md border border-[#d9e1dc] bg-white px-3 py-2 text-[#24302f]" href="/auth">
            登录
          </Link>
        </div>
      </nav>
    </header>
  );
}
