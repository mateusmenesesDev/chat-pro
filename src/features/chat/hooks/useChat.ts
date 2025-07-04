import { useCallback, useEffect, useRef, useState } from "react";
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
  const utils = api.useUtils();
  // Track processed message IDs to avoid duplicates
  const processedMessageIds = useRef(new Set<string>());

  const { data: conversation, isLoading: isLoadingMessages } =
    api.message.getByConversationByContactId.useQuery(
      { contactId: selectedContact?.id ?? "" },
      {
        enabled: !!selectedContact?.id,
        // Keep cache fresh
        refetchInterval: 30000,
      },
    );

  // Subscribe to new messages
  api.message.onNewMessage.useSubscription(undefined, {
    onStarted() {
      console.log("🔌 SSE connection opened");
    },
    onData(newMsg: unknown) {
      if (!newMsg) return;

      const typedMsg = newMsg as { type: string; message?: Message };
      if (typedMsg.type !== "message" || !typedMsg.message) return;

      const message = typedMsg.message;

      if (conversation?.id && message.conversationId === conversation.id) {
        setMessages((prev) => {
          // Check both state and ref for duplicates
          if (processedMessageIds.current.has(message.id)) {
            return prev;
          }

          // Add to processed set
          processedMessageIds.current.add(message.id);

          // Sort messages by sentAt to maintain chronological order
          const newMessages = [...prev, message].sort(
            (a, b) =>
              new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime(),
          );

          return newMessages;
        });

        // Invalidate the query to ensure we have the latest data
        void utils.message.getByConversationByContactId.invalidate({
          contactId: selectedContact?.id ?? "",
        });
      }
    },
    onError(err) {
      console.error("❌ SSE connection error:", err);
    },
  });

  // Update messages when conversation changes
  useEffect(() => {
    if (!conversation) {
      setMessages([]);
      processedMessageIds.current.clear();
      return;
    }

    // Sort messages by sentAt to maintain chronological order
    const sortedMessages = [...conversation.messages].sort(
      (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime(),
    );

    // Update processed message IDs
    processedMessageIds.current = new Set(sortedMessages.map((msg) => msg.id));
    setMessages(sortedMessages);
  }, [conversation]);

  const sendMessageMutation = api.message.send.useMutation({
    onSuccess: () => {
      // Invalidate queries to trigger a refresh
      void utils.message.getByConversationByContactId.invalidate({
        contactId: selectedContact?.id ?? "",
      });
    },
  });

  const sendMessage = useCallback(
    async (content: string, recipientId: string) => {
      if (!content.trim()) return;

      try {
        const sent = await sendMessageMutation.mutateAsync({
          message: content,
          recipientId,
          conversationId: conversation?.id,
        });

        if (sent) {
          setMessages((prev) => {
            // Check both state and ref for duplicates
            if (processedMessageIds.current.has(sent.id)) {
              return prev;
            }

            // Add to processed set
            processedMessageIds.current.add(sent.id);

            // Add new message and sort by sentAt
            const newMessages = [...prev, sent].sort(
              (a, b) =>
                new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime(),
            );
            return newMessages;
          });
        }

        return sent;
      } catch {
        console.error("❌ Failed to send message");
      }
    },
    [sendMessageMutation, conversation?.id, selectedContact?.id],
  );

  return {
    messages,
    isLoadingMessages,
    sendMessage,
  };
}
