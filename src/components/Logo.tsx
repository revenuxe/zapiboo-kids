import Link from "next/link";
import logoAsset from "@/assets/zapiboo-brand.webp";
const logo = logoAsset.src;
import { cn } from "@/lib/utils";

export function Logo({
  className,
  imageClassName,
  invert = false,
}: {
  className?: string;
  imageClassName?: string;
  invert?: boolean;
}) {
  return (
    <Link href="/" aria-label="Zapiboo home" className={cn("inline-flex items-center", className)}>
      <img
        src={logo}
        alt="Zapiboo - Sell Your Used Vehicle"
        width={1542}
        height={404}
        className={cn("h-10 w-auto md:h-12", imageClassName, invert && "")}
      />
    </Link>
  );
}
