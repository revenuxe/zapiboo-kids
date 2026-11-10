import Link from "next/link";
import { PageLoader } from "@/components/PageLoader";

export default function Loading() {
  return (
    <section className="pickup-studio">
      <div className="pickup-studio-shell">
        <h1 className="pickup-kicker">Sell your kids items</h1>
        <div className="pickup-route-loader">
          <PageLoader label="Preparing your selling form" full={false} />
        </div>
        <noscript>
          <style>{".pickup-route-loader { display: none; }"}</style>
          <p className="mt-5 text-sm">
            Enable JavaScript to use the selling form. You can still explore our item categories and
            preparation guides.
          </p>
          <Link href="/#sell-categories" className="mt-5 inline-flex font-semibold text-primary">
            Explore selling categories
          </Link>
        </noscript>
      </div>
    </section>
  );
}
