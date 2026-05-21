import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-2xl border border-line bg-white/72 px-4 py-3 text-sm text-ink outline-none transition focus:border-sage focus:ring-4 focus:ring-sage/10",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full resize-y rounded-3xl border border-line bg-white/72 px-5 py-4 text-sm leading-7 text-ink outline-none transition placeholder:text-muted/55 focus:border-sage focus:ring-4 focus:ring-sage/10",
        className,
      )}
      {...props}
    />
  );
}
