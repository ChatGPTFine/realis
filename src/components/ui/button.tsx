import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-night text-porcelain shadow-[0_18px_44px_rgba(39,54,49,0.22)] hover:-translate-y-0.5 hover:bg-[#17221f]",
  secondary:
    "bg-white/68 text-ink ring-1 ring-line shadow-[0_14px_34px_rgba(39,54,49,0.08)] hover:-translate-y-0.5 hover:bg-white",
  ghost: "text-muted hover:bg-white/55 hover:text-ink",
  outline: "border border-line bg-transparent text-ink hover:bg-white/70",
};

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-55";

export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}

export function ButtonLink({
  className,
  href,
  variant = "primary",
  ...props
}: React.ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link className={cn(base, variants[variant], className)} href={href} {...props} />;
}
