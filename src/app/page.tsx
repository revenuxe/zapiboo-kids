import Home from "@/views/index";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl, breadcrumbSchema, serviceSchema } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { homepageSearch } from "@/lib/service-search-content";
import { familyFaqs, familyServices } from "@/lib/family-service-catalog";
import { faqSchema, itemListSchema } from "@/lib/seo";

export const metadata = pageMetadata("/", homepageSearch.title, homepageSearch.description);
export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": absoluteUrl("/#webpage"),
            url: absoluteUrl("/"),
            name: homepageSearch.title,
            primaryImageOfPage: {
              "@type": "ImageObject",
              contentUrl: absoluteUrl("/vehicles/used-suvs-light.webp"),
              url: absoluteUrl("/vehicles/used-suvs-light.webp"),
              caption: "Used SUV on a light background",
            },
          },
          serviceSchema("/"),
          breadcrumbSchema([{ name: "Home", path: "/" }]),
          faqSchema(familyFaqs.map(([question, answer]) => ({ question, answer }))),
          itemListSchema(
            "Used vehicle selling services in Bangalore",
            familyServices.map((service) => ({
              name: service.name,
              path: `/services/${service.id}`,
            })),
          ),
        ]}
      />
      <Home />
    </>
  );
}
