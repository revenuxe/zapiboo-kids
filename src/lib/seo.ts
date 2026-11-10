import { serviceLocalities } from "@/lib/bangalore-data";

export const siteUrl = "https://www.zapiboo.com";

export const businessContact = {
  name: "Zapiboo",
  phone: "+91 9886579923",
  phoneHref: "tel:+919886579923",
  whatsappHref: "https://wa.me/919886579923",
  email: "zapiboo.com@gmail.com",
  emailHref: "mailto:zapiboo.com@gmail.com",
  address: "No 6, 1st Cross, Umar Nagar, Nagawara Main Road, Bangalore 560045",
  locality: "Nagawara",
  city: "Bangalore",
  region: "Karnataka",
  postalCode: "560045",
  country: "IN",
};

export type ServiceArea = {
  name: string;
  slug: string;
  pincode: string;
  nearby: string[];
};

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const nearbyByArea: Record<string, string[]> = {
  "HBR Layout": ["Kalyan Nagar", "Banaswadi", "Hennur"],
  Nagawara: ["Manyata Tech Park", "Thanisandra", "HBR Layout"],
  Whitefield: ["Brookefield", "Kadugodi", "ITPL"],
  "Electronic City": ["Neeladri Nagar", "Hosa Road", "Bommasandra"],
  "HSR Layout": ["Agara", "Sector 1", "Sector 7"],
  Koramangala: ["Ejipura", "Sony World", "Jakkasandra"],
  Marathahalli: ["Kundalahalli", "Munnekollal", "HAL Road"],
  Indiranagar: ["Domlur", "Old Airport Road", "CMH Road"],
  "JP Nagar": ["Jayanagar", "Bannerghatta Road", "Puttenahalli"],
  Hebbal: ["Manyata Tech Park", "Kempapura", "Sahakar Nagar"],
  Yelahanka: ["Jakkur", "Kogilu", "New Town"],
  Jayanagar: ["Basavanagudi", "South End Circle", "4th Block"],
  Banashankari: ["Kathriguppe", "Padmanabhanagar", "Uttarahalli"],
  "Sarjapur Road": ["Kaikondrahalli", "Doddakannelli", "Carmelaram"],
  "Kalyan Nagar": ["HBR Layout", "Kammanahalli", "Banaswadi"],
  Banaswadi: ["HRBR Layout", "Kalyan Nagar", "Ramamurthy Nagar"],
  "RT Nagar": ["Hebbal", "Sultanpalya", "Ganganagar"],
  "Sahakar Nagar": ["Hebbal", "Jakkur", "Kodigehalli"],
  Jakkur: ["Yelahanka", "Sahakar Nagar", "Thanisandra"],
  Kothanur: ["Hennur", "Thanisandra", "Narayanapura"],
  Thanisandra: ["Nagawara", "Manyata Tech Park", "Kothanur"],
  Horamavu: ["Banaswadi", "Ramamurthy Nagar", "Hennur"],
  "Ramamurthy Nagar": ["KR Puram", "Horamavu", "Banaswadi"],
  Mahadevapura: ["KR Puram", "Whitefield", "Marathahalli"],
  Brookefield: ["Whitefield", "Kundalahalli", "Marathahalli"],
  Kundalahalli: ["Brookefield", "Marathahalli", "Whitefield"],
  Kadugodi: ["Whitefield", "ITPL", "Hope Farm"],
  Domlur: ["Indiranagar", "Old Airport Road", "Ejipura"],
  "Cox Town": ["Frazer Town", "Cooke Town", "Benson Town"],
  "Frazer Town": ["Cox Town", "Pulikeshi Nagar", "Shivajinagar"],
  Basavanagudi: ["Jayanagar", "Gandhi Bazaar", "NR Colony"],
  Vijayanagar: ["Rajajinagar", "Nagarbhavi", "Attiguppe"],
  Yeshwanthpur: ["Malleswaram", "Rajajinagar", "Peenya"],
  Peenya: ["Yeshwanthpur", "Jalahalli", "Nagasandra"],
  Hennur: ["HBR Layout", "Kothanur", "Nagawara"],
  Kammanahalli: ["Kalyan Nagar", "HBR Layout", "Banaswadi"],
  "Manyata Tech Park": ["Nagawara", "Thanisandra", "Hebbal"],
};

export const serviceAreas: ServiceArea[] = serviceLocalities.map((area) => ({
  name: area.name,
  slug: toSlug(area.name),
  pincode: area.pincode,
  nearby: nearbyByArea[area.name] ?? [],
}));

export const featuredServiceAreas = [
  "hbr-layout",
  "nagawara",
  "whitefield",
  "electronic-city",
  "hsr-layout",
  "koramangala",
  "marathahalli",
  "indiranagar",
  "jp-nagar",
  "hebbal",
  "yelahanka",
  "jayanagar",
  "banashankari",
  "sarjapur-road",
  "kalyan-nagar",
  "btm-layout",
  "bellandur",
  "kr-puram",
  "rajajinagar",
  "malleshwaram",
];

export function getAreaBySlug(slug: string) {
  return serviceAreas.find((area) => area.slug === slug);
}

export function absoluteUrl(path = "/") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function organizationSchema(path = "/") {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${siteUrl}/#organization`,
    name: businessContact.name,
    url: siteUrl,
    logo: `${siteUrl}/zapiboo-logo.webp`,
    email: businessContact.email,
    telephone: businessContact.phoneHref.replace("tel:", ""),
    address: {
      "@type": "PostalAddress",
      streetAddress: "No 6, 1st Cross, Umar Nagar, Nagawara Main Road",
      addressLocality: businessContact.city,
      addressRegion: businessContact.region,
      postalCode: businessContact.postalCode,
      addressCountry: businessContact.country,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: businessContact.phoneHref.replace("tel:", ""),
      email: businessContact.email,
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["en", "hi", "kn"],
    },
    areaServed: serviceAreas.map((area) => ({
      "@type": "Place",
      name: `${area.name}, Bangalore`,
    })),
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Pre-loved kids item selling in Bangalore",
      },
    },
  };
}

export function localBusinessSchema(path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${absoluteUrl(path)}#localbusiness`,
    name: businessContact.name,
    url: absoluteUrl(path),
    parentOrganization: { "@id": `${siteUrl}/#organization` },
    telephone: businessContact.phoneHref.replace("tel:", ""),
    email: businessContact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "No 6, 1st Cross, Umar Nagar, Nagawara Main Road",
      addressLocality: businessContact.city,
      addressRegion: businessContact.region,
      postalCode: businessContact.postalCode,
      addressCountry: businessContact.country,
    },
    areaServed: { "@type": "City", name: "Bangalore" },
  };
}
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: businessContact.name,
    url: siteUrl,
  };
}

export function serviceSchema(path: string, area?: ServiceArea, serviceName?: string) {
  const name =
    serviceName ??
    (area
      ? `Sell pre-loved kids items in ${area.name}, Bangalore`
      : "Pre-loved kids item selling in Bangalore");

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(path)}#service`,
    name,
    serviceType: "Pre-loved kids item selling with doorstep pickup",
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: {
      "@type": "Place",
      name: area ? `${area.name}, Bangalore` : "Bangalore",
    },
    url: absoluteUrl(path),
  };
}
export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(items: ReadonlyArray<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function blogPostingSchema(input: {
  path: string;
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  keywords?: string[];
}) {
  const url = absoluteUrl(input.path);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: input.title,
    description: input.description,
    ...(input.image ? { image: [input.image] } : {}),
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    inLanguage: "en-IN",
    ...(input.keywords ? { keywords: input.keywords.join(", ") } : {}),
    author: {
      "@type": "Organization",
      name: input.authorName ?? businessContact.name,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: businessContact.name,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon.png`,
      },
    },
  };
}

export function howToSchema(input: {
  path: string;
  name: string;
  description: string;
  totalTime?: string;
  steps: Array<{ name: string; text: string }>;
}) {
  const url = absoluteUrl(input.path);
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${url}#howto`,
    name: input.name,
    description: input.description,
    ...(input.totalTime ? { totalTime: input.totalTime } : {}),
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: "0",
    },
    supply: [
      { "@type": "HowToSupply", name: "Pre-loved kids item in good condition" },
      { "@type": "HowToSupply", name: "Clear photos of the item" },
    ],
    tool: [{ "@type": "HowToTool", name: "Zapiboo marketplace app" }],
    step: input.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      url: `${url}#step-${index + 1}`,
    })),
  };
}

export function itemListSchema(
  name: string,
  items: ReadonlyArray<{ name: string; path?: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { url: absoluteUrl(item.path) } : {}),
    })),
  };
}
