import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { useContact } from "~/features/contact/hooks/useContact";
import { messagesAtom } from "~/store/chat";
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
  const { selectedContact } = useContact();
  const setAllMessages = useSetAtom(messagesAtom);
  const allMessages = useAtomValue(messagesAtom);

  const { data: conversation, isLoading: isLoadingMessages } =
    api.message.getByConversationByContactId.useQuery(
      { contactId: selectedContact?.id ?? "" },
      { enabled: !!selectedContact?.id },
    );

  useEffect(() => {
    if (!conversation?.id || !conversation.messages) return;

    setAllMessages((prev) => {
      const current = prev.get(conversation.id) ?? [];

      const merged = [...current, ...conversation.messages];

      const unique = Array.from(
        new Map(merged.map((msg) => [msg.id, msg])).values(),
      ).sort(
        (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime(),
      );

      const next = new Map(prev);
      next.set(conversation.id, unique);
      return next;
    });
  }, [conversation?.id, conversation?.messages, setAllMessages]);

  const messages = conversation?.id
    ? (allMessages.get(conversation.id) ?? [])
    : [];

  const sendMessageMutation = api.message.send.useMutation();

  const sendMessage = useCallback(
    async (content: string, recipientId: string) => {
      if (!content.trim()) return;

      try {
        await sendMessageMutation.mutateAsync({
          message: content,
          recipientId,
          conversationId: conversation?.id,
        });
      } catch {
        console.error("❌ Failed to send message");
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
