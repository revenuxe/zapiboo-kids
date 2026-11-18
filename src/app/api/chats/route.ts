import { chatError, chatSession, privateChatHeaders } from "@/lib/chat-server";
import { sameOrigin } from "@/lib/marketplace-server";
import { z } from "zod";
export async function GET() {
  try {
    const { db, user } = await chatSession();
    if (!user) return Response.json({ error: "Sign in to view your chats." }, { status: 401 });
    const { data, error } = await db.rpc("marketplace_chat_inbox");
    if (error) return chatError(error);
    return Response.json({ conversations: data }, { headers: privateChatHeaders });
  } catch (e) {
    return chatError(e);
  }
}
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  try {
    const { db, user } = await chatSession();
    if (!user) return Response.json({ error: "Sign in to message the seller." }, { status: 401 });
    const input = z
      .object({ listingId: z.string().uuid() })
      .safeParse(await request.json().catch(() => null));
    if (!input.success) return Response.json({ error: "Choose a valid vehicle." }, { status: 400 });
    const { data, error } = await db.rpc("marketplace_start_chat", {
      p_listing: input.data.listingId,
    });
    if (error) return chatError(error);
    return Response.json({ id: data }, { headers: privateChatHeaders });
  } catch (e) {
    return chatError(e);
  }
}
