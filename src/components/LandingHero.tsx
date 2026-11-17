import { HeadingText } from "@/components/HeadingText";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { businessContact } from "@/lib/seo";

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
                {action || "Enquire Service"}
                <ArrowUpRight size={19} />
              </Link>
              <a
                href={
                  businessContact.whatsappHref +
                  "?text=" +
                  encodeURIComponent(
                    "Hi Zapiboo, I would like to find services for my family. Can you help?",
                  )
                }
                target="_blank"
                rel="noreferrer"
                className="home-whatsapp-button"
              >
                <WhatsAppIcon className="size-5" /> Chat on WhatsApp <ArrowUpRight size={18} />
              </a>
            </div>
          )}
          <div className="landing-hero-notes">
            <span>
              <MapPin size={14} />
              Made for Bangalore
            </span>
            <span>
              <Heart size={14} />
              Care, learning and happy moments.
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
              PLAY. GROW.
            </span>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
