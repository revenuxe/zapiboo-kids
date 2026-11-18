"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import {
  ArrowLeft,
  ArrowUpRight,
  Archive,
  Ban,
  Check,
  CheckCheck,
  ChevronUp,
  Flag,
  Loader2,
  Send,
  ShieldCheck,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  chatFetch,
  containsContactDetails,
  contactPrivacyMessage,
  type ChatConversation,
  type ChatMessage,
} from "@/lib/chat";
import { listingPath, money } from "@/lib/marketplace";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
type ThreadData = { conversation: ChatConversation; messages: ChatMessage[]; hasMore: boolean };
function mergeMessages(...lists: ChatMessage[][]) {
  return [...new Map(lists.flat().map((m) => [m.id, m])).values()].sort(
    (a, b) => a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id),
  );
}
export function ChatThread({
  id,
  userId,
  onBack,
  onUpdate,
  onArchive,
}: {
  id: string;
  userId: string;
  onBack: () => void;
  onUpdate: () => void;
  onArchive: () => void;
}) {
  const { data, error, isLoading, mutate } = useSWR<ThreadData>("/api/chats/" + id, chatFetch, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
    shouldRetryOnError: true,
    errorRetryCount: 3,
    errorRetryInterval: 4000,
  });
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [olderBusy, setOlderBusy] = useState(false);
  const [text, setText] = useState("");
  const [draftReady, setDraftReady] = useState(false);
  const [sending, setSending] = useState(false);
  const sendingRef = useRef(false);
  const [sendError, setSendError] = useState("");
  const [actionBusy, setActionBusy] = useState(false);
  const [live, setLive] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reason, setReason] = useState("Suspicious or misleading listing");
  const scroll = useRef<HTMLDivElement>(null);
  const composer = useRef<HTMLTextAreaElement>(null);
  const nearBottom = useRef(true);
  const firstScroll = useRef(true);
  const retry = useRef<{ id: string; body: string } | null>(null);
  const storageKey = `zapiboo-message-draft-${userId}-${id}`;
  const thread = data?.conversation;
  const messages = useMemo(
    () => mergeMessages(history, data?.messages ?? []),
    [history, data?.messages],
  );
  const lastId = messages.at(-1)?.id;
  useEffect(() => {
    try {
      setText(sessionStorage.getItem(storageKey) ?? "");
    } catch {}
    setDraftReady(true);
  }, [storageKey]);
  useEffect(() => {
    if (!draftReady) return;
    const t = setTimeout(() => {
      try {
        text ? sessionStorage.setItem(storageKey, text) : sessionStorage.removeItem(storageKey);
      } catch {}
    }, 250);
    return () => clearTimeout(t);
  }, [text, draftReady, storageKey]);
  useEffect(() => {
    if (data) {
      setHistory((current) => mergeMessages(current, data.messages));
      if (firstScroll.current) setHasMore(data.hasMore);
    }
  }, [data]);
  useEffect(() => {
    const channel = supabase
      .channel("vehicle-thread-" + id)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "vehicle_chat_messages",
          filter: `conversation_id=eq.${id}`,
        },
        () => {
          mutate();
          onUpdate();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "vehicle_conversations",
          filter: `id=eq.${id}`,
        },
        () => {
          mutate();
        },
      )
      .subscribe((status) => {
        setLive(status === "SUBSCRIBED");
        if (status === "SUBSCRIBED") mutate();
      });
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, mutate]);
  useEffect(() => {
    if (!lastId) return;
    const latest = messages.at(-1);
    if (firstScroll.current || nearBottom.current || latest?.sender_id === userId) {
      requestAnimationFrame(() => {
        scroll.current?.scrollTo({
          top: scroll.current.scrollHeight,
          behavior: firstScroll.current ? "instant" : "smooth",
        });
        firstScroll.current = false;
      });
    }
  }, [lastId]);
  useEffect(() => {
    if (!lastId) return;
    const mark = () => {
      if (document.visibilityState !== "visible") return;
      fetch("/api/chats/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "read" }),
      })
        .then((r) => {
          if (r.ok) onUpdate();
        })
        .catch(() => {});
    };
    mark();
    window.addEventListener("focus", mark);
    document.addEventListener("visibilitychange", mark);
    return () => {
      window.removeEventListener("focus", mark);
      document.removeEventListener("visibilitychange", mark);
    };
  }, [id, lastId]);
  async function older() {
    if (!messages.length || olderBusy) return;
    setOlderBusy(true);
    const height = scroll.current?.scrollHeight ?? 0;
    const top = scroll.current?.scrollTop ?? 0;
    try {
      const first = messages[0];
      const result: ThreadData = await chatFetch(
        `/api/chats/${id}?before=${encodeURIComponent(first.created_at)}&beforeId=${first.id}`,
      );
      setHistory((current) => mergeMessages(current, result.messages));
      setHasMore(result.hasMore);
      requestAnimationFrame(() => {
        if (scroll.current) scroll.current.scrollTop = top + scroll.current.scrollHeight - height;
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't load earlier messages.");
    } finally {
      setOlderBusy(false);
    }
  }
  async function action(action: string) {
    if (actionBusy) return;
    setActionBusy(true);
    try {
      const r = await fetch("/api/chats/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...(action === "report" ? { reason } : {}) }),
      });
      const b = await r.json();
      if (!r.ok) throw new Error(b.error);
      if (action === "archive") {
        toast.success("Conversation archived.");
        onArchive();
      } else {
        await mutate();
        onUpdate();
        if (action === "report") {
          setReportOpen(false);
          toast.success("Your report has been saved for review.");
        } else
          toast.success(action === "block" ? "Conversation blocked." : "Conversation unblocked.");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't update this conversation.");
    } finally {
      setActionBusy(false);
    }
  }
  async function send() {
    const body = text.trim();
    if (!body || sendingRef.current) return;
    if (containsContactDetails(body)) {
      setSendError(contactPrivacyMessage);
      return;
    }
    if (!thread || thread.buyer_blocked || thread.seller_blocked) return;
    setSendError("");
    sendingRef.current = true;
    setSending(true);
    if (!retry.current || retry.current.body !== body)
      retry.current = { id: crypto.randomUUID(), body };
    try {
      const r = await fetch("/api/chats/" + id, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(retry.current),
      });
      const b = await r.json();
      if (!r.ok) throw new Error(b.error);
      setHistory((current) => mergeMessages(current, [b.message]));
      setText((current) => (current.trim() === body ? "" : current));
      if (composer.current?.value.trim() === body) {
        try {
          sessionStorage.removeItem(storageKey);
        } catch {
          /* Sending still succeeds if browser storage is unavailable. */
        }
      }
      retry.current = null;
      nearBottom.current = true;
      mutate();
      onUpdate();
      composer.current?.focus();
    } catch (e) {
      setSendError(e instanceof Error ? e.message : "Couldn't confirm delivery. Please try again.");
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  }
  if (isLoading)
    return (
      <section className="chat-thread chat-thread-loading" role="status">
        <Loader2 className="animate-spin" size={28} />
        Opening your conversation…
      </section>
    );
  if (!thread)
    return (
      <section className="chat-thread chat-thread-loading">
        <ShieldCheck size={30} />
        <h2>This conversation isn&apos;t available.</h2>
        <p>{error?.message ?? "Only the buyer and seller can view this conversation."}</p>
        <button className="mp-btn-secondary" onClick={onBack}>
          Back to chats
        </button>
        <button className="mp-btn-secondary" onClick={() => mutate()}>
          Try again
        </button>
      </section>
    );
  const buying = thread.buyer_id === userId;
  const name = buying ? thread.seller_name : thread.buyer_name;
  const blocked = thread.buyer_blocked || thread.seller_blocked;
  const blockedByMe = buying ? thread.buyer_blocked : thread.seller_blocked;
  const otherRead = buying ? thread.seller_read_at : thread.buyer_read_at;
  return (
    <section className="chat-thread">
      <header className="chat-thread-heading">
        <button className="chat-mobile-back" onClick={onBack} aria-label="Back to conversations">
          <ArrowLeft size={20} />
        </button>
        <div className="chat-person-avatar">{name.slice(0, 1).toUpperCase()}</div>
        <div>
          <h2>{name}</h2>
          <span>
            {buying ? "Seller" : "Buyer"} · <ShieldCheck size={11} />
            Contact details stay private
          </span>
        </div>
        <div className="chat-thread-actions">
          <button
            aria-label="Archive conversation"
            title="Archive conversation"
            onClick={() => action("archive")}
            disabled={actionBusy}
          >
            <Archive size={17} />
          </button>
          <button
            aria-label={blockedByMe ? "Unblock conversation" : "Block conversation"}
            title={blockedByMe ? "Unblock conversation" : "Block conversation"}
            className={blockedByMe ? "is-blocked" : ""}
            disabled={actionBusy}
            onClick={() => {
              if (
                blockedByMe ||
                window.confirm(
                  "Block this conversation? Neither person can send messages until it is unblocked.",
                )
              )
                action(blockedByMe ? "unblock" : "block");
            }}
          >
            <Ban size={17} />
          </button>
          <button
            aria-label="Report conversation"
            title="Report conversation"
            onClick={() => setReportOpen(true)}
          >
            <Flag size={17} />
          </button>
        </div>
      </header>
      <Link href={listingPath({ id: thread.listing_id, title: thread.listing_title })} className="chat-vehicle-strip">
        <div>
          <Image src={thread.listing_photo} alt="" fill sizes="65px" />
        </div>
        <span>
          <strong>{thread.listing_title}</strong>
          <small>{money(thread.listing_price)} · View vehicle</small>
        </span>
        <ArrowUpRight size={17} />
      </Link>
      <div className="chat-private-notice">
        <ShieldCheck size={14} />
        <span>
          Stay in the conversation. Phone numbers, email addresses and off-platform links are
          blocked.
        </span>
      </div>
      {error && (
        <div className="chat-connection-error" role="status">
          We couldn't refresh this conversation. Your saved messages are still here.
          <button onClick={() => mutate()}>Retry</button>
        </div>
      )}
      <div
        className="chat-messages"
        ref={scroll}
        role="log"
        aria-label="Conversation messages"
        aria-live="polite"
        aria-relevant="additions"
        onScroll={() => {
          if (scroll.current)
            nearBottom.current =
              scroll.current.scrollHeight - scroll.current.scrollTop - scroll.current.clientHeight <
              130;
        }}
      >
        {hasMore && (
          <button className="chat-load-older" onClick={older} disabled={olderBusy}>
            {olderBusy ? <Loader2 size={14} className="animate-spin" /> : <ChevronUp size={14} />}
            Earlier messages
          </button>
        )}
        {messages.length === 0 ? (
          <div className="chat-thread-empty">
            <span>Say hello to {name.split(" ")[0]}.</span>
            <p>Ask about the vehicle, its condition or a convenient time for a viewing.</p>
          </div>
        ) : (
          messages.map((m, i) => {
            const own = m.sender_id === userId;
            const day = new Date(m.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
            });
            const previousDay = i ? new Date(messages[i - 1].created_at).toDateString() : "";
            const read = Date.parse(otherRead) >= Date.parse(m.created_at);
            return (
              <div key={m.id}>
                {previousDay !== new Date(m.created_at).toDateString() && (
                  <div className="chat-day">
                    <span>{day}</span>
                  </div>
                )}
                <div className={`chat-message ${own ? "is-own" : ""}`}>
                  <div className="chat-bubble">
                    <p>{m.body}</p>
                    <span>
                      <time>
                        {new Date(m.created_at).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                      {own &&
                        (read ? (
                          <CheckCheck size={13} aria-label="Read" />
                        ) : (
                          <Check size={13} aria-label="Sent" />
                        ))}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {blocked ? (
        <div className="chat-blocked">
          <Ban size={19} />
          <div>
            <strong>This conversation is blocked.</strong>
            <p>
              {blockedByMe
                ? "You can unblock it whenever you are ready."
                : "The other participant has paused this conversation."}
            </p>
          </div>
          {blockedByMe && (
            <button onClick={() => action("unblock")} disabled={actionBusy}>
              Unblock
            </button>
          )}
        </div>
      ) : (
        <form
          className="chat-composer"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          {messages.length < 3 && (
            <div className="chat-quick-replies">
              {(buying
                ? [
                    "Is this still available?",
                    "Can I arrange a viewing?",
                    "Is the price negotiable?",
                  ]
                : [
                    "Yes, it is available.",
                    "When would you like to see it?",
                    "Happy to answer your questions.",
                  ]
              ).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => {
                    setText(t);
                    setSendError("");
                    composer.current?.focus();
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
          {sendError && (
            <div className="chat-send-error" role="alert">
              <ShieldCheck size={14} />
              <span>{sendError}</span>
              <button
                type="button"
                aria-label="Dismiss message warning"
                onClick={() => setSendError("")}
              >
                <X size={14} />
              </button>
            </div>
          )}
          <div className="chat-composer-row">
            <textarea
              ref={composer}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setSendError("");
              }}
              rows={2}
              maxLength={2000}
              placeholder={"Message " + name.split(" ")[0] + "…"}
              aria-label="Write a message"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={!text.trim() || sending || actionBusy}
            >
              {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
          <div className="chat-composer-footer">
            <span>
              {live ? <Wifi size={11} /> : <WifiOff size={11} />}{" "}
              {live ? "Live updates" : "Checking for new messages automatically"}
            </span>
            <span>{text.length}/2000 · Enter to send</span>
          </div>
        </form>
      )}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="max-w-md">
          <DialogTitle>Report this conversation</DialogTitle>
          <DialogDescription>
            Choose what concerns you. Your report is private and does not notify the other
            participant.
          </DialogDescription>
          <label className="chat-report-label">
            Reason
            <select value={reason} onChange={(e) => setReason(e.target.value)}>
              {[
                "Suspicious or misleading listing",
                "Attempts to share personal contact details",
                "Harassment or abusive messages",
                "Requests for advance payment",
                "Other concern",
              ].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <button className="mp-btn" onClick={() => action("report")} disabled={actionBusy}>
            {actionBusy ? <Loader2 className="animate-spin" size={16} /> : <Flag size={16} />}Submit
            report
          </button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
