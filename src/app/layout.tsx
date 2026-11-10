import { getPublicSellingCategories } from "@/lib/selling-catalog-server";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Manrope, Sora } from "next/font/google";
import { Providers } from "./providers";
import { siteUrl, organizationSchema, websiteSchema } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/metadata";
import "@/styles.css";

const manrope = Manrope({ subsets: ["latin"], display: "swap", variable: "--font-manrope" });
const sora = Sora({ subsets: ["latin"], display: "swap", variable: "--font-sora" });

// Public content can be prerendered; pages reading cookies or searchParams
// still opt into request-time rendering automatically.
export const runtime = "nodejs";
export const metadata: Metadata = {
  ...pageMetadata(
    "/",
    "Zapiboo | Pre-Loved Kids Marketplace — Sell Used Kids Toys, Books & Gear",
    "Sell pre-loved kids toys, books, clothing and baby gear in Bangalore. Share item details, get selling support and arrange doorstep pickup when available.",
  ),
  metadataBase: new URL(siteUrl),
  authors: [{ name: "Zapiboo" }],
  icons: {
    icon: [
      { url: "/favicon.ico?v=4fdb249e4599", type: "image/x-icon", sizes: "16x16 32x32 48x48" },
      { url: "/favicon-32x32.png?v=4fdb249e4599", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png?v=4fdb249e4599", type: "image/png", sizes: "16x16" },
    ],
    shortcut: "/favicon.ico?v=4fdb249e4599",
    apple: [{ url: "/apple-touch-icon.png?v=4fdb249e4599", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest?v=4fdb249e4599",
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#edf5ff" };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const categories = await getPublicSellingCategories();
  return (
    <html lang="en" className={`${manrope.variable} ${sora.variable}`}>
      <body>
        <noscript>
          <style>
            {
              '[data-ssr-reveal], main [style*="opacity:0"], main [style*="opacity: 0"] { opacity: 1 !important; transform: none !important; }'
            }
          </style>
        </noscript>
        <JsonLd data={[organizationSchema("/"), websiteSchema()]} />
        <Providers initialUser={null} initialCategories={categories}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
