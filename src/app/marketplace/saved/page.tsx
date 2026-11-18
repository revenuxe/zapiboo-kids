import { Marketplace } from "@/components/marketplace/Marketplace";
import { pageMetadata } from "@/lib/metadata";
export const metadata=pageMetadata("/marketplace/saved","Saved vehicles | Zapiboo","Your saved vehicles, all in one place.",true);
export default function Page() { return <Marketplace initialView="saved"/>; }
