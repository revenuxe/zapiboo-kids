import About from "@/views/about";
import { pageMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/seo";

export const metadata = pageMetadata(
  "/about",
  "About Zapiboo | Sell Your Used Vehicle in Bangalore",
  "Learn how Zapiboo helps owners in Bangalore start selling used cars, bikes, scooters, SUVs, commercial and electric vehicles.",
);

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <About />
    </>
  );
}
