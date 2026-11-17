import type { FamilyService } from "@/lib/family-service-catalog";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  ClipboardCheck,
  Check,
  Heart,
  Layers3,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const moments = [
  {
    category: "play-entertainment",
    label: "MAKE TIME FOR PLAY",
    title: "Big adventures.\nLittle happy faces.",
    text: "Play zones, family workshops and new adventures for curious little explorers.",
    className: "moment-play",
  },
  {
    category: "classes-activities",
    label: "FOLLOW THEIR CURIOSITY",
    title: "A new interest.\nA world of possibility.",
    text: "Discover art, music, dance, sports and hands-on learning beyond the classroom.",
    className: "moment-books",
  },
  {
    category: "preschool-daycare",
    label: "A CONFIDENT FIRST STEP",
    title: "Little milestones.\nA caring place to grow.",
    text: "Explore early learning and daycare around your child’s age and your daily routine.",
    className: "moment-gear",
  },
];

export function HomeMoments({ categories }: { categories: readonly FamilyService[] }) {
  return (
    <section className="home-shell home-section" aria-labelledby="home-moments-title">
      <div className="home-section-heading">
        <div>
          <span className="home-eyebrow">SOUND A LITTLE FAMILIAR?</span>
          <h2 id="home-moments-title">
            They wonder.
            <br />
            Let them discover.
          </h2>
        </div>
        <p>
          A new skill, a caring space, a day out.
          <br />
          Find a starting point that feels like them.
        </p>
      </div>
      <div className="home-moments-grid">
        {moments
          .filter((moment) => categories.some((category) => category.id === moment.category))
          .map((moment) => (
            <Link
              key={moment.category}
              href={`/services/${moment.category}`}
              className={`home-moment ${moment.className}`}
            >
              <span className="home-eyebrow">{moment.label}</span>
              <h3>
                {moment.title.split("\n").map((line, index) => (
                  <span key={line}>
                    {index > 0 && <br />}
                    {line}
                  </span>
                ))}
              </h3>
              <p>{moment.text}</p>
              <div className="home-moment-image">
                <Image
                  src={
                    categories.find((category) => category.id === moment.category)?.image_url ||
                    `/services/${moment.category}.webp`
                  }
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 480px, 85vw"
                />
              </div>
              <span className="home-moment-link">
                {moment.category === "play-entertainment"
                  ? "Discover places to play"
                  : moment.category === "classes-activities"
                    ? "Explore classes & activities"
                    : "Explore preschool & daycare"}
                <ArrowUpRight size={19} />
              </span>
            </Link>
          ))}
      </div>
    </section>
  );
}

export function HomePreparation() {
  return (
    <section className="home-preparation-section">
      <div className="home-shell home-preparation-grid">
        <div className="home-prep-board">
          <div className="home-prep-board-top">
            <span className="home-eyebrow">YOUR FAMILY SERVICE CHECKLIST</span>
            <span>
              <Heart size={16} />
            </span>
          </div>
          <h3>
            A few good questions.
            <br />A confident next step.
          </h3>
          <div className="home-prep-tasks">
            {[
              {
                icon: Sparkles,
                title: "The right fit",
                text: "Check age suitability, location and timings.",
              },
              {
                icon: ShieldCheck,
                title: "Care & experience",
                text: "Discuss supervision, training and references.",
              },
              {
                icon: ClipboardCheck,
                title: "Clear arrangements",
                text: "Ask about fees, inclusions and cancellation terms.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <span className="home-prep-task-icon">
                  <Icon size={20} strokeWidth={1.6} />
                </span>
                <div>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
                <Check size={17} />
              </div>
            ))}
          </div>
          <span className="home-prep-board-note">
            <BookOpen size={15} /> Every family is different. Start with yours.
          </span>
        </div>
        <div className="home-prep-copy">
          <span className="home-eyebrow">A GOOD START MAKES ALL THE DIFFERENCE</span>
          <h2>
            Ready to find
            <br />
            your family’s fit?
          </h2>
          <p>
            Start with your child’s age, your area and what you need. Add preferred timings and a
            budget so the conversation begins with what matters to you.
          </p>
          <div className="home-prep-tip">
            <span>GOOD TO KNOW</span>
            <p>
              Visit a preschool, ask about a class trial or meet a caregiver before committing.
              Confirm availability and fees directly with the provider.
            </p>
          </div>
          <Link href="/contact" className="home-text-link">
            Tell us what your family needs
            <ArrowUpRight size={19} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomeCollectionSupport() {
  return (
    <section className="home-shell home-collection-wrap">
      <div className="home-collection">
        <div className="home-collection-icon">
          <Layers3 size={32} strokeWidth={1.5} />
        </div>
        <div>
          <span className="home-eyebrow">SOME PLANS NEED A LITTLE MORE HELP</span>
          <h2>
            A birthday coming up?
            <br />
            Let&apos;s talk.
          </h2>
          <p>
            A birthday party, a new childcare routine or a question about a milestone. Tell us what
            you have in mind and ask about the next steps.
          </p>
        </div>
        <Link href="/contact" className="home-collection-link">
          <MessageCircle size={18} />
          Talk about your plans
          <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  );
}

export function HomeFinalCta() {
  return (
    <section className="home-shell home-final-wrap" aria-labelledby="home-cta-title">
      <div className="home-grand-cta">
        <div className="home-grand-copy">
          <span className="home-eyebrow">
            <span />
            THEIR NEXT CHAPTER STARTS WITH YOU
          </span>
          <h2 id="home-cta-title">
            Little discoveries.
            <br />
            Happy memories.
            <br />
            <span>New beginnings.</span>
          </h2>
          <p>
            Find the care, learning and play they need.
            <br />
            Make space for whatever comes next.
          </p>
          <div className="home-grand-actions">
            <Link href="/contact" className="home-grand-button">
              Explore family services
              <ArrowUpRight size={22} />
            </Link>
            <Link href="/contact">
              Need a hand?
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <span className="home-grand-note">
            Availability and fees are confirmed before you book.
          </span>
        </div>
        <div className="home-grand-art" aria-hidden="true">
          <div className="home-grand-orbit" />
          <div className="home-grand-toys">
            <span>READY FOR MORE PLAY</span>
            <Image
              src="/services/play-entertainment.webp"
              alt=""
              width={340}
              height={270}
              sizes="(max-width: 639px) 230px, 340px"
            />
            <strong>
              So many ways to grow.
              <Heart size={18} />
            </strong>
          </div>
          <div className="home-grand-books">
            <Image
              src="/services/classes-activities-art.webp"
              alt=""
              width={200}
              height={160}
              sizes="180px"
            />
            <span>A new discovery.</span>
          </div>
          <span className="home-grand-stamp">
            <Sparkles size={22} />
            GOOD THINGS
            <br />
            KEEP GOING
          </span>
        </div>
      </div>
    </section>
  );
}

export function HomeQuickStart({ categories }: { categories: readonly FamilyService[] }) {
  return (
    <section className="home-shell home-quickstart-wrap">
      <div className="home-quickstart">
        <div>
          <span className="home-eyebrow">EVERYDAY NEEDS. SPECIAL OCCASIONS.</span>
          <h2>
            Looking for something?
            <br />
            <span>Let&apos;s make a start.</span>
          </h2>
          <p>
            Choose a service and tell us your area, your child’s age and what you are looking for.
            Your next step begins with a conversation.
          </p>
          <div className="home-quickstart-actions">
            <Link href="/contact" className="home-button">
              Send a service enquiry
              <ArrowUpRight size={20} />
            </Link>
            <Link href="/contact" className="home-text-link">
              Need guidance? Let&apos;s talk
              <ArrowUpRight size={17} />
            </Link>
          </div>
          <small>An enquiry is a starting point; it does not confirm a booking.</small>
        </div>
        <div className="home-quickstart-options">
          <span className="home-eyebrow">PICK YOUR STARTING POINT</span>
          {categories
            .slice(0, 4)
            .map((category) => ({ id: category.id, label: category.name }))
            .map((item) => (
              <Link key={item.id} href={`/services/${item.id}`}>
                <span>
                  <Check size={14} />
                </span>
                {item.label}
                <ArrowUpRight size={17} />
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
