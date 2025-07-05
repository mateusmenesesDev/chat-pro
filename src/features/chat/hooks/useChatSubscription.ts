import { useSetAtom } from "jotai";
import { messagesAtom } from "~/store/chat";
import { api } from "~/trpc/react";
import type { Message } from "./useChat";

export function useChatSubscription() {
  const setMessages = useSetAtom(messagesAtom);

  api.message.onNewMessage.useSubscription(
    { conversationId: undefined },
    {
      onStarted() {
        console.log("✅ Global subscription ativa");
      },

      onData(newMsg) {
        const typedMsg = newMsg as { type: string; message?: Message };
        if (typedMsg.type !== "message" || !typedMsg.message) return;

        const msg = typedMsg.message;

        setMessages((prev) => {
          const current = prev.get(msg.conversationId) ?? [];
          if (current.some((m) => m.id === msg.id)) return prev;

          const updated = [...current, msg].sort(
            (a, b) =>
              new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime(),
          );

          const next = new Map(prev);
          next.set(msg.conversationId, updated);
          return next;
        });
      },
      onError(err) {
        console.error("❌ Subscription error:", err);
      },
    },
  );
}
