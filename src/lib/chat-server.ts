import "server-only";
import { marketplaceDb } from "./marketplace-server";
export const privateChatHeaders = { "Cache-Control": "private, no-store" };
export function chatError(error: unknown) {
  const message =
    typeof error === "object" && error && "message" in error ? String(error.message) : "";
  const safe =
    /^(Please sign in|This vehicle|You cannot start|You can start up to|Conversation not found|This conversation is blocked|Keep contact details private|Write a message|You are sending messages|Choose a reason|Message reference already used)/.test(
      message,
    );
  return Response.json(
    { error: safe ? message : "Chat is temporarily unavailable. Please try again." },
    { status: safe ? 400 : 503, headers: privateChatHeaders },
  );
}
export async function chatSession() {
  const db = await marketplaceDb();
  const {
    data: { user },
  } = await db.auth.getUser();
  return { db, user };
}
