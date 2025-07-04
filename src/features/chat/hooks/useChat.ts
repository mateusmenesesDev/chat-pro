import { useCallback, useEffect, useState } from "react";
import { useContact } from "~/features/contact/hooks/useContact";
import { api } from "~/trpc/react";

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  sentAt: Date;
  readAt: Date | null;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { selectedContact } = useContact();

  const { data: conversation, isLoading: isLoadingMessages } =
    api.message.getByConversationByContactId.useQuery(
      { contactId: selectedContact?.id ?? "" },
      { enabled: !!selectedContact?.id },
    );

  api.message.onNewMessage.useSubscription(undefined, {
    onStarted() {
      console.log("🔌 [useChat] WebSocket connection started");
    },
    onData(newMsg: unknown) {
      if (!newMsg) return;

      const typedMsg = newMsg as { type: string; message?: Message };
      if (typedMsg.type !== "message" || !typedMsg.message) return;

      const message = typedMsg.message;

      if (conversation?.id && message.conversationId === conversation.id) {
        setMessages((prev) => {
          const messageExists = prev.some((msg) => msg.id === message.id);
          if (messageExists) {
            console.log("🔄 [useChat] Message already exists, skipping");
            return prev;
          }

          const newMessages = [...prev, message].sort(
            (a, b) =>
              new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime(),
          );

          console.log("📝 [useChat] Updating messages:", {
            previous: prev.length,
            new: newMessages.length,
          });
          return newMessages;
        });
      }
    },
    onError(err) {
      console.error("❌ [useChat] WebSocket subscription error:", err);
    },
  });

  // Update messages when conversation changes
  useEffect(() => {
    if (!conversation) {
      setMessages([]);
      return;
    }

    const sortedMessages = [...conversation.messages].sort(
      (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime(),
    );

    setMessages(sortedMessages);
  }, [conversation]);

  const sendMessageMutation = api.message.send.useMutation();

  const sendMessage = useCallback(
    async (content: string, recipientId: string) => {
      if (!content.trim()) return;

      try {
        console.log("📤 [useChat] Sending message:", {
          content,
          recipientId,
          conversationId: conversation?.id,
        });

        const sent = await sendMessageMutation.mutateAsync({
          message: content,
          recipientId,
          conversationId: conversation?.id,
        });

        if (sent) {
          setMessages((prev) => {
            if (prev.some((msg) => msg.id === sent.id)) {
              return prev;
            }

            const newMessages = [...prev, sent].sort(
              (a, b) =>
                new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime(),
            );
            return newMessages;
          });
        }

        return sent;
      } catch {
        console.error("❌ [useChat] Failed to send message:");
      }
    },
    [sendMessageMutation, conversation?.id],
  );

  return {
    messages,
    isLoadingMessages,
    sendMessage,
  };
}
