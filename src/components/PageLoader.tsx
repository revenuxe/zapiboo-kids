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
      <div className="zap-loader-mark" aria-hidden="true">
        <span className="zap-loader-track" />
        <span className="zap-loader-orb zap-loader-orb-one" />
        <span className="zap-loader-orb zap-loader-orb-two" />
        <span className="zap-loader-logo">
          <img
            src={logo}
            alt=""
            aria-hidden
            className="h-7 w-auto"
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
      <span className="zap-inline-loader" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      {label}
    </span>
  );
}
