import logoAsset from "@/assets/zapiboo-kids-logo.webp";
const logo = logoAsset.src;
import { cn } from "@/lib/utils";

/**
 * Brand-forward page loader. Pulses the Zapiboo mark inside a soft glow ring —
 * used across route transitions, dashboards and long buttons so the wait
 * never feels dead.
 */
export function PageLoader({
  label = "Loading…",
  full = true,
  className,
}: {
  label?: string;
  full?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        full ? "min-h-[60vh] w-full" : "py-10",
        className,
      )}
    >
      <div className="relative flex size-20 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/25" />
        <span className="absolute inset-2 rounded-full bg-primary/10 blur-md" />
        <span className="relative flex size-16 items-center justify-center rounded-2xl bg-background shadow-elevated ring-1 ring-border">
          <img
            src={logo}
            alt=""
            aria-hidden
            className="h-8 w-auto animate-pulse"
          />
        </span>
      </div>
      {label && (
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
      )}
    </div>
  );
}

/** Compact inline spinner for buttons, tables and cards. */
export function InlineLoader({
  label,
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <span className="relative inline-flex size-4">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
        <span className="relative inline-flex size-4 rounded-full bg-gradient-brand" />
      </span>
      {label}
    </span>
  );
}
