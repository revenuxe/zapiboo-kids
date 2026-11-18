"use client";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useChatInbox } from "@/hooks/use-chat-inbox";
import { usePathname } from "next/navigation";
export function ChatsLink() {
  const { unread } = useChatInbox(true);
  const active = usePathname() === "/chats";
  return (
    <Link
      href="/chats"
      className={`site-chats-link ${active ? "is-active" : ""}`}
      aria-label={`Chats${unread ? `, ${unread} unread messages` : ""}`}
    >
      <MessageCircle size={19} />
      <span>Chats</span>
      {unread > 0 && <b>{unread > 99 ? "99+" : unread}</b>}
    </Link>
  );
}
