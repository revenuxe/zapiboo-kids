"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  MessageCircle,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Inbox,
  Archive,
  RefreshCw,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useChatInbox } from "@/hooks/use-chat-inbox";
import type { ChatConversation } from "@/lib/chat";
import { ChatThread } from "./ChatThread";
export function ChatInbox({
  initialConversation,
  listingId,
}: {
  initialConversation?: string;
  listingId?: string;
}) {
  const { user, loading } = useAuth();
  const { data, error, isLoading, mutate } = useChatInbox();
  const [selected, setSelected] = useState(initialConversation ?? "");
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState("");
  const started = useRef("");
  function select(id: string) {
    setSelected(id);
    const url = new URL(window.location.href);
    url.searchParams.delete("listing");
    if (id) url.searchParams.set("conversation", id);
    else url.searchParams.delete("conversation");
    window.history.replaceState(null, "", url.pathname + url.search);
  }
  async function start() {
    if (!listingId || !user) return;
    setStarting(true);
    setStartError("");
    try {
      const r = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      const b = await r.json();
      if (!r.ok) throw new Error(b.error);
      select(b.id);
      mutate();
    } catch (e) {
      setStartError(e instanceof Error ? e.message : "Couldn't start this conversation.");
    } finally {
      setStarting(false);
    }
  }
  useEffect(() => {
    if (!user || !listingId || started.current === listingId) return;
    started.current = listingId;
    start();
  }, [user?.id, listingId]);
  const conversations = data?.conversations ?? [];
  const filtered = conversations.filter(
    (c) =>
      (tab === "archived" ? c.archived : !c.archived) &&
      (tab === "buying"
        ? c.role === "buying"
        : tab === "selling"
          ? c.role === "selling"
          : tab === "unread"
            ? Number(c.unread_count) > 0
            : true) &&
      `${c.listing_title} ${c.buyer_id === user?.id ? c.seller_name : c.buyer_name} ${c.last_message ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase().trim()),
  );
  const unread = conversations
    .filter((c) => !c.archived)
    .reduce((n, c) => n + Number(c.unread_count ?? 0), 0);
  const returnPath =
    "/chats" +
    (listingId
      ? "?listing=" + encodeURIComponent(listingId)
      : selected
        ? "?conversation=" + encodeURIComponent(selected)
        : "");
  return (
    <div className="chat-page">
      <div className="chat-shell">
        <div className="chat-page-heading">
          <div>
            <span className="mp-eyebrow">GOOD CONVERSATIONS. BETTER DEALS.</span>
            <h1>
              Your chats<span>.</span>
            </h1>
            <p>Every vehicle. Every conversation. One private space.</p>
          </div>
          <span className="chat-privacy-pill">
            <ShieldCheck size={15} />
            Your number stays private
          </span>
        </div>
        {!user && !loading ? (
          <section className="chat-signin">
            <div className="chat-empty-art">
              <MessageCircle size={39} />
              <ShieldCheck size={21} />
            </div>
            <h2>A new conversation starts here.</h2>
            <p>
              Sign in to talk to buyers and sellers, ask about vehicles and arrange a viewing. Your
              phone number stays private.
            </p>
            <Link className="mp-btn" href={"/auth?redirectTo=" + encodeURIComponent(returnPath)}>
              Sign in to open Chats <ArrowRight size={16} />
            </Link>
            <Link href="/marketplace">Explore the marketplace</Link>
          </section>
        ) : (
          <div className={`chat-workspace ${selected ? "has-selection" : ""}`}>
            <aside className="chat-inbox">
              <div className="chat-inbox-heading">
                <h2>Messages {unread > 0 && <span>{unread}</span>}</h2>
                <button aria-label="Refresh chats" onClick={() => mutate()}>
                  <RefreshCw size={16} />
                </button>
              </div>
              <label className="chat-search">
                <Search size={17} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search a name or vehicle"
                  aria-label="Search chats"
                />
                {search && (
                  <button onClick={() => setSearch("")} aria-label="Clear chat search">
                    <X size={13} />
                  </button>
                )}
              </label>
              <div className="chat-tabs" role="tablist" aria-label="Chat categories">
                {[
                  ["all", "All"],
                  ["buying", "Buying"],
                  ["selling", "Selling"],
                  ["unread", "Unread"],
                ].map(([id, label]) => (
                  <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>
                    {label}
                  </button>
                ))}
              </div>
              <div className="chat-conversation-list">
                {loading || isLoading ? (
                  <div className="chat-list-loading" role="status">
                    <Loader2 size={23} className="animate-spin" />
                    Loading your conversations…
                  </div>
                ) : error ? (
                  <div className="chat-list-empty">
                    <Inbox size={27} />
                    <h3>We couldn&apos;t load your inbox.</h3>
                    <p>{error.message}</p>
                    <button onClick={() => mutate()}>Try again</button>
                  </div>
                ) : filtered.length ? (
                  filtered.map((c) => (
                    <Conversation
                      key={c.id}
                      conversation={c}
                      active={selected === c.id}
                      userId={user?.id ?? ""}
                      onClick={() => select(c.id)}
                    />
                  ))
                ) : (
                  <div className="chat-list-empty">
                    <MessageCircle size={29} />
                    <h3>
                      {tab === "unread"
                        ? "All caught up."
                        : search
                          ? "No matching conversations."
                          : tab === "archived"
                            ? "Nothing archived yet."
                            : "Your next deal starts with hello."}
                    </h3>
                    <p>
                      {tab === "unread"
                        ? "New messages will appear here."
                        : search
                          ? "Try another name or vehicle."
                          : "Open a vehicle listing and choose Chat with seller to start."}
                    </p>
                    <Link href="/marketplace">
                      Find your next ride <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
              <button
                className={`chat-archive-toggle ${tab === "archived" ? "is-active" : ""}`}
                onClick={() => setTab(tab === "archived" ? "all" : "archived")}
              >
                <Archive size={15} />
                {tab === "archived" ? "Back to active chats" : "Archived conversations"}
                <span>{conversations.filter((c) => c.archived).length || ""}</span>
              </button>
              <div className="chat-inbox-privacy">
                <ShieldCheck size={14} />
                <span>Chat here. Keep personal contact details to yourself.</span>
              </div>
            </aside>
            {selected && user ? (
              <ChatThread
                key={selected}
                id={selected}
                userId={user.id}
                onBack={() => select("")}
                onUpdate={() => mutate()}
                onArchive={() => {
                  select("");
                  mutate();
                }}
              />
            ) : (
              <section className="chat-welcome">
                <div className="chat-empty-art">
                  <MessageCircle size={48} />
                  <ShieldCheck size={23} />
                </div>
                <span className="mp-eyebrow">A LITTLE HELLO GOES A LONG WAY</span>
                <h2>
                  {starting ? "Opening your conversation…" : "Find your next chapter, together."}
                </h2>
                <p>
                  Choose a conversation to ask questions, discuss the price or arrange a viewing.
                  One vehicle, one conversation. Everything stays in Zapiboo.
                </p>
                {starting ? (
                  <Loader2 className="animate-spin" size={23} />
                ) : startError ? (
                  <div className="chat-start-error" role="alert">
                    {startError}
                    <button className="mp-btn-secondary" onClick={start}>
                      Try again
                    </button>
                  </div>
                ) : (
                  <Link href="/marketplace" className="mp-btn-secondary">
                    Explore vehicles <ArrowRight size={16} />
                  </Link>
                )}
                <div className="chat-welcome-features">
                  <span>
                    <ShieldCheck size={16} />
                    No phone numbers shared
                  </span>
                  <span>
                    <MessageCircle size={16} />
                    Separate buyer & seller chats
                  </span>
                  <span>
                    <Archive size={16} />
                    Your inbox, organised
                  </span>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
function Conversation({
  conversation: c,
  active,
  userId,
  onClick,
}: {
  conversation: ChatConversation;
  active: boolean;
  userId: string;
  onClick: () => void;
}) {
  const buying = c.buyer_id === userId;
  const name = buying ? c.seller_name : c.buyer_name;
  const time = new Date(c.updated_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
  return (
    <button
      className={`chat-conversation ${active ? "is-selected" : ""} ${Number(c.unread_count) > 0 ? "has-unread" : ""}`}
      onClick={onClick}
      aria-label={`${name}, ${c.listing_title}${c.unread_count ? `, ${c.unread_count} unread` : ""}`}
      aria-current={active ? "true" : undefined}
    >
      <div className="chat-conversation-image">
        <Image src={c.listing_photo} alt="" fill sizes="54px" />
        <span>{name.slice(0, 1).toUpperCase()}</span>
      </div>
      <div className="chat-conversation-copy">
        <div>
          <strong>{name}</strong>
          <time>{time}</time>
        </div>
        <h3>{c.listing_title}</h3>
        <p>
          {c.buyer_blocked || c.seller_blocked
            ? "Conversation blocked"
            : c.last_message
              ? (c.last_sender_id === userId ? "You: " : "") + c.last_message
              : "Start with a friendly hello."}
        </p>
        <span className="chat-role">{buying ? "Buying" : "Selling"}</span>
      </div>
      {Number(c.unread_count) > 0 && (
        <b className="chat-unread-badge">{Number(c.unread_count) > 99 ? "99+" : c.unread_count}</b>
      )}
    </button>
  );
}
