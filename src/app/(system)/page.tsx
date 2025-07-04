"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarImage } from "~/common/components/ui/avatar";
import { Button } from "~/common/components/ui/button";
import { Card } from "~/common/components/ui/card";
import { Input } from "~/common/components/ui/input";
import { EmptyState } from "~/features/chat/components/EmptyState";
import { MessageBubble } from "~/features/chat/components/MessageBubble";
import { useChat } from "~/features/chat/hooks/useChat";
import { ContactList } from "~/features/contact/components/ContactList";
import { useContact } from "~/features/contact/hooks/useContact";

export default function ChatInterface() {
  const [newMessage, setNewMessage] = useState("");
  const { selectedContact } = useContact();
  const { sendMessage, messages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    void sendMessage(newMessage, selectedContact?.id ?? "");
    setNewMessage("");
  };

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      void handleSendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-81px)]">
      {/* Contact List */}
      <div className="w-80 border-r">
        <ContactList />
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col">
        {selectedContact ? (
          <>
            {/* Contact Header */}
            <div className="border-b p-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={selectedContact?.imageUrl}
                    alt={selectedContact?.name ?? ""}
                  />
                </Avatar>
                <div>
                  <h2 className="font-medium">{selectedContact?.name ?? ""}</h2>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <EmptyState />
              ) : (
                messages.map((message) => (
                  <MessageBubble key={message?.id} message={message} />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <Card className="bg-card/80 rounded-none border-t p-4 backdrop-blur-sm">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Input
                    value={newMessage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewMessage(e.target.value)
                    }
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                    className="bg-background/50 border-border/50 focus:border-primary focus:ring-primary min-h-[44px] resize-none rounded-xl"
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  variant="default"
                  size="icon"
                  className="h-[44px] min-w-[44px] rounded-xl"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </Button>
              </div>
            </Card>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-muted-foreground text-center">
              <p>Select a contact to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
