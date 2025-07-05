"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarImage } from "~/common/components/ui/avatar";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { EmptyState } from "~/features/chat/components/EmptyState";
import { MessageBubble } from "~/features/chat/components/MessageBubble";
import { useChat } from "~/features/chat/hooks/useChat";
import { useChatSubscription } from "~/features/chat/hooks/useChatSubscription";
import { ContactList } from "~/features/contact/components/ContactList";
import { useContact } from "~/features/contact/hooks/useContact";

export default function ChatInterface() {
  useChatSubscription();

  const [newMessage, setNewMessage] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    if (!newMessage.trim()) return;
    void sendMessage(newMessage, selectedContact?.id ?? "");
    setNewMessage("");
  };

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSendMessage();
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen pt-[72px]">
      {/* Contact List - Mobile Responsive */}
      <div
        className={`bg-background/95 fixed inset-y-0 left-0 z-[99999] w-80 transform overflow-y-auto border-t border-r transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ContactList onContactSelect={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Main Chat Container */}
      <div className="flex flex-1 flex-col">
        <div className="bg-background w-full border-b border-l p-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 lg:hidden"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
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

        <div className="flex flex-1 flex-col overflow-auto">
          {selectedContact ? (
            <>
              <div className="flex-1">
                <div className="flex min-h-full flex-col justify-end space-y-3 p-4">
                  {messages.length === 0 ? (
                    <EmptyState />
                  ) : (
                    messages.map((message) => (
                      <MessageBubble key={message?.id} message={message} />
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center p-4">
              <div className="text-muted-foreground text-center">
                <p>Select a contact to start chatting</p>
              </div>
            </div>
          )}
        </div>
        <div className="bg-background border-t p-2 sm:p-3">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                value={newMessage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewMessage(e.target.value)
                }
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="bg-background/50 border-border/50 focus:border-primary focus:ring-primary min-h-[40px] resize-none rounded-full text-sm"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              variant="default"
              size="icon"
              className="h-10 w-10 shrink-0 rounded-full"
            >
              <svg
                className="h-4 w-4"
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
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[80] bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ top: "73px" }}
        />
      )}
    </div>
  );
}
