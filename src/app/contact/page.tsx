import Contact from "@/views/contact";
import { pageMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, localBusinessSchema } from "@/lib/seo";
import { familyServices } from "@/lib/family-service-catalog";
import { getAreaBySlug } from "@/lib/seo";
export const metadata = pageMetadata(
  "/contact",
  "Contact Zapiboo - Talk to Our Team",
  "Looking to sell your used car, bike, scooter or another vehicle? Contact the Zapiboo team - we usually reply within one business day.",
);
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; area?: string; subject?: string }>;
}) {
  const { service: id, area: areaSlug, subject } = await searchParams;
  const area = getAreaBySlug(areaSlug ?? "");
  const service = familyServices.find((item) => item.id === id);
  return (
    <>
      <JsonLd
        data={[
          localBusinessSchema("/contact"),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />
      <Contact
        key={`${service?.id ?? "general"}-${area?.slug ?? "city"}-${subject ?? ""}`}
        subjectText={subject?.slice(0, 200)}
        serviceName={service?.name}
        areaName={area?.name}
      />
    </>
  );
}
