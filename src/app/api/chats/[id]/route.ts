import { chatError, chatSession, privateChatHeaders } from "@/lib/chat-server";
import { sameOrigin } from "@/lib/marketplace-server";
import { containsContactDetails, contactPrivacyMessage } from "@/lib/chat";
import { z } from "zod";
type Context = { params: Promise<{ id: string }> };
const uuid = z.string().uuid();
export async function GET(request: Request, { params }: Context) {
  try {
    const { id } = await params;
    if (!uuid.safeParse(id).success)
      return Response.json({ error: "Conversation not found." }, { status: 404 });
    const { db, user } = await chatSession();
    if (!user) return Response.json({ error: "Please sign in." }, { status: 401 });
    const { data: conversation, error: threadError } = await db
      .from("vehicle_conversations")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (threadError) return chatError(threadError);
    if (!conversation) return Response.json({ error: "Conversation not found." }, { status: 404 });
    const search = new URL(request.url).searchParams;
    const before = search.get("before"),
      beforeId = search.get("beforeId");
    let query = db
      .from("vehicle_chat_messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(41);
    if (before) {
      if (
        !z.string().datetime({ offset: true }).safeParse(before).success ||
        !uuid.safeParse(beforeId).success
      )
        return Response.json({ error: "Invalid message cursor." }, { status: 400 });
      query = query.or(`created_at.lt.${before},and(created_at.eq.${before},id.lt.${beforeId})`);
    }
    const { data: messages, error } = await query;
    if (error) return chatError(error);
    return Response.json(
      {
        conversation,
        messages: (messages ?? []).slice(0, 40).reverse(),
        hasMore: (messages?.length ?? 0) > 40,
      },
      { headers: privateChatHeaders },
    );
  } catch (e) {
    return chatError(e);
  }
}
export async function POST(request: Request, { params }: Context) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  try {
    const { id } = await params;
    if (!uuid.safeParse(id).success)
      return Response.json({ error: "Conversation not found." }, { status: 404 });
    const { db, user } = await chatSession();
    if (!user) return Response.json({ error: "Please sign in." }, { status: 401 });
    if (Number(request.headers.get("content-length")) > 16000)
      return Response.json({ error: "This message is too long." }, { status: 413 });
    const input = z
      .object({ id: uuid, body: z.string().trim().min(1).max(2000) })
      .safeParse(await request.json().catch(() => null));
    if (!input.success)
      return Response.json(
        { error: "Write a message between 1 and 2000 characters." },
        { status: 400 },
      );
    if (containsContactDetails(input.data.body))
      return Response.json({ error: contactPrivacyMessage }, { status: 422 });
    const { data, error } = await db.rpc("marketplace_send_message", {
      p_conversation: id,
      p_message: input.data.id,
      p_body: input.data.body,
    });
    if (error) return chatError(error);
    return Response.json({ message: data }, { headers: privateChatHeaders });
  } catch (e) {
    return chatError(e);
  }
}
export async function PATCH(request: Request, { params }: Context) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  try {
    const { id } = await params;
    if (!uuid.safeParse(id).success)
      return Response.json({ error: "Conversation not found." }, { status: 404 });
    const { db, user } = await chatSession();
    if (!user) return Response.json({ error: "Please sign in." }, { status: 401 });
    const input = z
      .object({
        action: z.enum(["read", "archive", "unarchive", "block", "unblock", "report"]),
        reason: z.string().trim().min(3).max(500).optional(),
      })
      .safeParse(await request.json().catch(() => null));
    if (!input.success)
      return Response.json({ error: "Invalid conversation action." }, { status: 400 });
    const { error } = await db.rpc("marketplace_chat_action", {
      p_conversation: id,
      p_action: input.data.action,
      p_reason: input.data.reason ?? null,
    });
    if (error) return chatError(error);
    return Response.json({ ok: true }, { headers: privateChatHeaders });
  } catch (e) {
    return chatError(e);
  }
}
