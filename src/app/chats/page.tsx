import { ChatInbox } from "@/components/chats/ChatInbox";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "/chats",
  "Your Chats | Zapiboo",
  "Keep buyer and seller conversations together in your private Zapiboo inbox.",
  true,
);
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ conversation?: string; listing?: string }>;
}) {
  const params = await searchParams;
  return <ChatInbox initialConversation={params.conversation} listingId={params.listing} />;
}
