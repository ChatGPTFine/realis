import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function Card(
  { className, ...props },
  ref,
) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-line/80 bg-white/74 shadow-[0_24px_70px_rgba(39,54,49,0.08)]",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

export function SoftPanel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-line/70 bg-porcelain/62", className)} {...props} />;
}
