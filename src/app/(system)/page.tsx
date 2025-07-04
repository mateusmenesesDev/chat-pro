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
    <div className="flex h-screen pt-[73px]">
      {/* Contact List - Mobile Responsive */}
      <div
        className={`bg-background/95 fixed inset-y-0 left-0 z-[99999] w-80 transform overflow-y-auto border-t border-r transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ top: "72px", height: "calc(100vh - 72px)" }}
      >
        <ContactList onContactSelect={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Main Chat Container */}
      <div className="flex flex-1 flex-col">
        {/* Mobile Header */}
        <div
          className="bg-background fixed inset-x-0 z-[90] border-b lg:hidden"
          style={{ top: "72px" }}
        >
          <div className="flex items-center px-3 py-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
            {selectedContact && (
              <div className="ml-3 flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={selectedContact?.imageUrl}
                    alt={selectedContact?.name ?? ""}
                  />
                </Avatar>
                <span className="text-sm font-medium">
                  {selectedContact?.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Header */}
        <div className="bg-background fixed hidden w-full border-b border-l p-3 lg:block">
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

        {/* Chat Content */}
        <div className="flex flex-1 flex-col overflow-auto">
          {selectedContact ? (
            <>
              {/* Messages Area */}
              <div
                className="flex-1 overflow-y-auto"
                style={{
                  height: "calc(100vh - 73px - 65px - 49px)", // viewport - main header - input - mobile header
                  marginTop: "49px", // mobile header height
                }}
              >
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

              {/* Message Input */}
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
