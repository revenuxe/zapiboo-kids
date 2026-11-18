import { MyListings } from "@/components/marketplace/MyListings";
import { pageMetadata } from "@/lib/metadata";
export const metadata=pageMetadata("/marketplace/my-listings","My Listings | Zapiboo","Manage your vehicle listings and track admin approvals.",true);
export default function Page() { return <MyListings/>; }
