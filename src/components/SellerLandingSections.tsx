import Link from "next/link";
import { ArrowUpRight, Camera, Heart, MessageCircle, PackageCheck, Truck } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { businessContact, type ServiceArea } from "@/lib/seo";
import type { SellingCategory } from "@/lib/selling-categories";
import { servicesPaused } from "@/lib/launch-status";

export function SellerActions({
  href,
  message,
  action = "Start selling",
}: {
  href: string;
  message: string;
  action?: string;
}) {
  return (
    <div className="seller-content-actions">
      <Link href={href} className="home-button">
        {action} <ArrowUpRight size={18} />
      </Link>
      <a
        href={`${businessContact.whatsappHref}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noreferrer"
        className="home-whatsapp-button"
      >
        <WhatsAppIcon className="size-5" /> Chat on WhatsApp <ArrowUpRight size={17} />
      </a>
    </div>
  );
}

export function SellerBenefits({
  href,
  location = "Bangalore",
}: {
  href: string;
  location?: string;
}) {
  return (
    <section className="seller-benefits-section">
      <div className="home-shell seller-section">
        <div className="home-section-heading">
          <div>
            <span className="home-eyebrow">LESS TO MANAGE. MORE ROOM TO GROW.</span>
            <h2>
              A little help with
              <br />
              their next chapter.
            </h2>
          </div>
          <p>
            From your first question to the handover,
            <br />
            know what you are agreeing to.
          </p>
        </div>
        <div className="seller-benefit-cards">
          {[
            {
              Icon: MessageCircle,
              title: "A conversation to start",
              text: "Unsure which category fits or how to describe a bundle? Ask our team about your items before you work through the selling form.",
            },
            {
              Icon: Truck,
              title: "Pickup planned with you",
              text: `Share your exact ${location} address and any access details. Our team confirms collection availability and arrangements before you plan a handover.`,
            },
            {
              Icon: Heart,
              title: "Useful things can keep going",
              text: "Well-kept toys, books and baby essentials can still have a place in another family's day. Describe their condition so the next steps start with a clear picture.",
            },
          ].map(({ Icon, title, text }) => (
            <article key={title}>
              <span className="seller-section-icon">
                <Icon size={25} strokeWidth={1.6} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <SellerActions
          href={href}
          message={`Hi Zapiboo, I would like help selling pre-loved kids items in ${location}.`}
        />
        <p className="seller-content-note">
          {servicesPaused
            ? "Pickup is opening soon. You can explore the selling flow while bookings are paused."
            : "Item acceptance, pickup timing and sale details are confirmed after review."}
        </p>
      </div>
    </section>
  );
}

export function AreaSellingMoments({ area }: { area: ServiceArea }) {
  const href = `/pickup?pincode=${area.pincode}`;
  return (
    <section className="home-shell seller-section">
      <div className="home-section-heading">
        <div>
          <span className="home-eyebrow">ROOM FOR WHAT COMES NEXT</span>
          <h2>
            New stages.
            <br />A little more space.
          </h2>
        </div>
        <p>
          Planning a clear-out in {area.name}?<br />
          Start with one shelf, one box or one outgrown favourite.
        </p>
      </div>
      <div className="seller-moment-grid">
        {[
          {
            label: "01 / GROWING UP",
            title: "They have moved on to bigger things",
            text: "The first cycle, the early-reader books, the clothes that no longer fit. Sort by category and keep sizes, reading stages and accessories together.",
            link: "Share outgrown items",
          },
          {
            label: "02 / MAKING SPACE",
            title: "The toy shelf needs a fresh start",
            text: "Pick out toys and games your child no longer reaches for. Check sets for missing pieces and group related items into a collection you can describe clearly.",
            link: "Start with a collection",
          },
          {
            label: "03 / MOVING HOME",
            title: "Less to pack for the next address",
            text: `Set aside the kids items you do not plan to take from your ${area.name} home. Share larger gear details early and confirm pickup timing before relying on it for moving day.`,
            link: "Share your item details",
          },
        ].map(({ label, title, text, link }) => (
          <article key={title}>
            <span className="home-eyebrow">{label}</span>
            <h3>{title}</h3>
            <p>{text}</p>
            <Link href={href} className="home-text-link">
              {link}
              <ArrowUpRight size={17} />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

const categoryDetails: Record<
  string,
  { heading: string; details: string[]; example: string; photo: string }
> = {
  toys: {
    heading: "Tell us what is in the toy box",
    details: [
      "Brand or toy name, if known, and the number of items in the set.",
      "Which pieces, instruction sheets or accessories are included.",
      "Working features and any cracks, wear or missing pieces.",
    ],
    example:
      "Wooden train set with 24 track pieces and three trains. One train has a chipped corner. Storage bag included; original box missing.",
    photo:
      "Lay out the set with its pieces visible. Add a closer view of any wear you describe so a complete set and an incomplete one are easy to tell apart.",
  },
  books: {
    heading: "Give the collection a little context",
    details: [
      "Number of books, main titles or series, and language.",
      "Reading stage and whether the series or set is complete.",
      "Writing, torn pages, water marks or damage to the covers and binding.",
    ],
    example:
      "Six English board books and four picture books for early readers. Two covers are creased. One book has a name written inside; no missing pages.",
    photo:
      "Show the covers or readable spines together. Include a view of any marked pages or damaged binding, and keep children's personal details out of the photo.",
  },
  clothing: {
    heading: "Make the sizes and condition clear",
    details: [
      "Label sizes, approximate item count and the types of clothing.",
      "Any mixed sizes in the bundle, plus shoes or accessories included.",
      "Stains, fading, loose stitching or damaged buttons and zips.",
    ],
    example:
      "Eight washed tops and four pairs of shorts, mostly labelled 3–4 years. Two tops have faded prints. No shoes or accessories included.",
    photo:
      "Lay clean, dry clothing flat in good light. Show size labels and any visible wear; a child does not need to model the items.",
  },
  gear: {
    heading: "The useful details for bigger essentials",
    details: [
      "Brand, model and approximate age, where known.",
      "Included cushions, trays, straps and assembly instructions.",
      "Whether folds, locks and adjustments work, plus any damage or missing parts.",
    ],
    example:
      "Foldable stroller with canopy and storage basket. Fold lock and brakes work. Fabric has fading; cup holder is missing. Model label is available.",
    photo:
      "Show the whole item assembled, the model label and the accessories. Include clear views of damage and describe any issue that cannot be seen in a photo.",
  },
  cycles: {
    heading: "Help us understand the next little ride",
    details: [
      "Cycle or ride-on type, brand and wheel size if known.",
      "Working brakes, steering and tyres, with any repairs needed.",
      "Training wheels, chargers or other accessories included.",
    ],
    example:
      "16-inch kids bicycle with training wheels. Brakes work and tyres hold air. Scratches on the frame; bell missing. No helmet included.",
    photo:
      "Photograph the full cycle from the side, then show tyre wear and any damaged parts. For battery ride-ons, show the charger and describe battery performance.",
  },
  electronics: {
    heading: "A clear picture of how it works",
    details: [
      "Brand, model and the main learning or play features.",
      "Whether it powers on, holds charge and responds to its controls.",
      "Included chargers, cables and accessories, plus any faults.",
    ],
    example:
      "Kids learning tablet with matching charger. Screen and buttons work. Battery lasts about an hour of use. Scratches on the back; original box missing.",
    photo:
      "Show the device and accessories together, with a closer view of wear. Remove personal accounts and avoid showing names, logins or other private information.",
  },
};

export function CategoryListingHelp({ category }: { category: SellingCategory }) {
  const details = categoryDetails[category.id] || {
    heading: `A helpful description of your ${category.name.toLowerCase()}`,
    details: [
      "Item name, approximate age and quantity.",
      "Condition, included accessories and any missing parts.",
      "Working features and anything that needs attention.",
    ],
    example:
      "Describe what the item is, what is included and any wear or damage. Mention differences in condition when sharing a collection.",
    photo:
      "Show the whole item and its accessories in good light. Describe any issue that the photo does not show.",
  };
  return (
    <section className="home-shell seller-section">
      <div className="home-section-heading">
        <div>
          <span className="home-eyebrow">GOOD DETAILS MAKE A GOOD START</span>
          <h2>{details.heading}</h2>
        </div>
        <p>
          No perfect listing needed.
          <br />A few honest details help our team review your items.
        </p>
      </div>
      <div className="seller-description-grid">
        <div className="seller-description-card">
          <PackageCheck size={28} strokeWidth={1.5} />
          <h3>Three things worth mentioning</h3>
          <ol>
            {details.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ol>
          <div className="seller-description-example">
            <span className="home-eyebrow">AN EXAMPLE, IN YOUR OWN WORDS</span>
            <p>{details.example}</p>
          </div>
        </div>
        <div className="seller-photo-guide">
          <span className="seller-section-icon">
            <Camera size={28} strokeWidth={1.5} />
          </span>
          <h3>A photo that tells the story</h3>
          <p>{details.photo}</p>
          <p>
            Photos are optional. If you do not have one handy, use the notes to describe what our
            team should know.
          </p>
          <SellerActions
            href={`/pickup?category=${category.id}`}
            message={`Hi Zapiboo, I have a question about selling ${category.name.toLowerCase()}.`}
          />
        </div>
      </div>
    </section>
  );
}

export function SellerQuestionBanner({
  href,
  subject = "pre-loved kids items",
}: {
  href: string;
  subject?: string;
}) {
  return (
    <section className="home-shell seller-section">
      <div className="seller-question-banner">
        <span className="seller-section-icon">
          <MessageCircle size={28} />
        </span>
        <div>
          <span className="home-eyebrow">ONE QUESTION CAN BE A GOOD START</span>
          <h2>Not sure where your items fit?</h2>
          <p>
            Ask us about your {subject}, a mixed bundle or the details to include. Tell us what you
            have and our team can help you choose the next step.
          </p>
          <SellerActions
            href={href}
            message={`Hi Zapiboo, can you help me with selling ${subject}?`}
          />
          <Link href="/contact" className="home-text-link">
            More ways to contact us
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
