export const contactPrivacyMessage =
  "Keep contact details private. Phone numbers, email, links and off-platform handles are not allowed.";
export function containsContactDetails(value: string): boolean {
  const alphabets = ["٠١٢٣٤٥٦٧٨٩", "۰۱۲۳۴۵۶۷۸۹", "०१२३४५६७८९", "০১২৩৪৫৬৭৮৯"];
  let text = value
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .toLowerCase();
  for (const alphabet of alphabets)
    text = Array.from(text)
      .map((c) => (alphabet.includes(c) ? String(alphabet.indexOf(c)) : c))
      .join("");
  const words: Record<string, string> = {
    zero: "0",
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
    oh: "0",
  };
  text = text.replace(
    /zero|one|two|three|four|five|six|seven|eight|nine|oh/g,
    (word) => words[word],
  );
  return (
    /(?:\d[\s().+/-]*){9,}/.test(text) ||
    /(?:zero|one|two|three|four|five|six|seven|eight|nine|oh)(?:[\s,.-]*(?:zero|one|two|three|four|five|six|seven|eight|nine|oh)){6,}/.test(
      text,
    ) ||
    /@|https?:\/\/|www\.|[a-z0-9-]+\.(?:com|in|net|org|me|co)(?:[^a-z]|$)/.test(text) ||
    /whats\s*app|telegram|instagram|snapchat|wa\.me|t\.me|\binsta\b|\b(?:on|via|using)\s+signal\b|\bsignal\s+(?:app|id|username)\b/.test(
      text,
    )
  );
}
export type ChatMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};
export type ChatConversation = {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  buyer_name: string;
  seller_name: string;
  listing_title: string;
  listing_photo: string;
  listing_price: number;
  buyer_read_at: string;
  seller_read_at: string;
  buyer_archived: boolean;
  seller_archived: boolean;
  buyer_blocked: boolean;
  seller_blocked: boolean;
  last_message: string | null;
  last_sender_id: string | null;
  updated_at: string;
  created_at: string;
  role?: "buying" | "selling";
  archived?: boolean;
  blocked_by_me?: boolean;
  unread_count?: number;
};
export const chatFetch = async (url: string) => {
  const response = await fetch(url, { cache: "no-store" });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "Couldn't load your chats.");
  return data;
};
