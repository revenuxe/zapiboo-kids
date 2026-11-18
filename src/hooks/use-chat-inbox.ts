"use client";
import { useEffect, useId } from "react";
import useSWR from "swr";
import { useAuth } from "./use-auth";
import { supabase } from "@/integrations/supabase/client";
import { chatFetch, type ChatConversation } from "@/lib/chat";
export function useChatInbox(realtime = false) {
  const { user } = useAuth();
  const instance = useId();
  const result = useSWR<{ conversations: ChatConversation[] }>(
    user ? "/api/chats" : null,
    chatFetch,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 4000,
    },
  );
  const { mutate } = result;
  useEffect(() => {
    if (!user || !realtime) return;
    const channel = supabase
      .channel(`chat-inbox-${user.id}-${instance}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "vehicle_conversations",
          filter: `buyer_id=eq.${user.id}`,
        },
        () => {
          mutate();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "vehicle_conversations",
          filter: `seller_id=eq.${user.id}`,
        },
        () => {
          mutate();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, realtime, instance, mutate]);
  return {
    ...result,
    unread:
      result.data?.conversations
        .filter((c) => !c.archived)
        .reduce((sum, c) => sum + Number(c.unread_count ?? 0), 0) ?? 0,
  };
}
