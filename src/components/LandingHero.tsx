import { HeadingText } from "@/components/HeadingText";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart, MapPin } from "lucide-react";
import type { ReactNode } from "react";

export function LandingHero({
  eyebrow,
  title,
  description,
  href,
  action,
  image,
  imageAlt,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  href?: string;
  action?: string;
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
}) {
  return (
    <section className="landing-hero">
      <div className="home-shell landing-hero-grid">
        <div className="landing-hero-copy">
          <span className="home-eyebrow">
            <span className="home-status-dot" />
            {eyebrow}
          </span>
          <h1>
            <HeadingText>{title}</HeadingText>
          </h1>
          <p>{description}</p>
          {href && (
            <div className="home-hero-actions">
              <Link href={href} className="home-button">
                {action || "Start selling"}
                <ArrowUpRight size={19} />
              </Link>
              <Link href="/marketplace" className="home-whatsapp-button">
                Browse listings <ArrowUpRight size={18} />
              </Link>
            </div>
          )}
          <div className="landing-hero-notes">
            <span>
              <MapPin size={14} />
              Made for Bangalore
            </span>
            <span>
              <Heart size={14} />
              Your vehicle. Your next chapter.
            </span>
          </div>
        </div>
        {image ? (
          <div className="landing-art-wrap">
            <div className="landing-art-card">
              <span className="home-eyebrow">GOOD THINGS KEEP GOING</span>
              <Image
                src={image}
                alt={imageAlt || ""}
                width={480}
                height={360}
                preload
                sizes="(min-width: 1024px) 430px, 85vw"
              />
              <div>
                <strong>{imageAlt}</strong>
                <span>
                  <ArrowUpRight size={22} />
                </span>
              </div>
            </div>
            <span className="landing-art-sticker">
              LEARN.
              <br />
              PLAY. DRIVE.
            </span>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
