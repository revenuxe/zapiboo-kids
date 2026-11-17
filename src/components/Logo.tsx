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
        alt="Zapiboo — Kids & Family Services"
        width={944}
        height={272}
        className={cn("h-10 w-auto md:h-12", imageClassName, invert && "brightness-0 invert")}
      />
    </Link>
  );
}
