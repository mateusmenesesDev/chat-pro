import { useAtomValue } from "jotai";
import { useCallback } from "react";
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

  const { data: conversation, isLoading: isLoadingMessages } =
    api.message.getByConversationByContactId.useQuery(
      { contactId: selectedContact?.id ?? "" },
      { enabled: !!selectedContact?.id },
    );

  const allMessages = useAtomValue(messagesAtom);
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
