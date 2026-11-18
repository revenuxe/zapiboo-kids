export function GET() {
  return Response.json(
    { error: "Phone numbers are private. Please use in-app Chats to contact the seller." },
    { status: 410, headers: { "Cache-Control": "private, no-store" } },
  );
}
