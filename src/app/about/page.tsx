import About from "@/views/about";
import { pageMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/seo";

export const metadata = pageMetadata(
  "/about",
  "About Zapiboo | Kids & Family Services in Bangalore",
  "Learn how Zapiboo helps families explore early learning, childcare, activities, celebrations and development support in Bangalore.",
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
