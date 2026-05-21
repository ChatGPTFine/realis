import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "warm";

const variants: Record<BadgeVariant, string> = {
  default: "border-line/80 bg-white/70 text-muted",
  warm: "border-clay/18 bg-clay/10 text-clay",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
