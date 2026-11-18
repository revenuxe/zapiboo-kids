import { familyServices } from "@/lib/family-service-catalog";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Check, ChevronDown } from "lucide-react";
export function HomeServiceGuide() {
  return (
    <section id="what-we-pick-up" className="home-pickup-guide">
      <div className="home-shell home-section">
        <div className="home-section-heading">
          <div>
            <span className="home-eyebrow">FIND YOUR VEHICLE CATEGORY</span>
            <h2>
              Cars, bikes and beyond.
              <br />
              <span>A starting point for every seller.</span>
            </h2>
          </div>
          <p>
            Choose your category.
            <br />
            See what to prepare before you sell.
          </p>
        </div>
        <div className="home-guide-grid">
          {familyServices.map((c) => (
            <article key={c.id} className="home-guide-card">
              <div className="home-guide-card-heading">
                <span className="home-guide-thumbnail" style={{ backgroundColor: c.accent_color }}>
                  <Image src={c.image_url} alt="" width={85} height={75} />
                </span>
                <div>
                  <h3>{c.name}</h3>
                  <Link href={"/marketplace?category=" + c.id}>
                    View category <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
              <ul className="home-guide-types">
                {c.types.map((t) => (
                  <li key={t}>
                    <Check size={13} />
                    {t}
                  </li>
                ))}
              </ul>
              <details className="home-guide-preparation">
                <summary>
                  Before you sell <ChevronDown size={15} />
                </summary>
                <p>{c.preparation}</p>
              </details>
              <Link href={"/marketplace/sell?category=" + c.id} className="home-guide-sell">
                Start selling <ArrowUpRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
