"use client";

import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { Button } from "~/common/components/ui/button";
import { Card } from "~/common/components/ui/card";
import { Input } from "~/common/components/ui/input";
import { ContactList } from "~/features/chat/components/ContactList";
import { EmptyState } from "~/features/chat/components/EmptyState";
import { MessageBubble } from "~/features/chat/components/MessageBubble";
import type { Message } from "~/features/chat/types/Message";

// Sample contacts data
const SAMPLE_CONTACTS = [
  {
    id: "1",
    name: "ChatPro",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    lastMessage: "That's really interesting!",
    lastMessageTime: new Date(),
  },
  {
    id: "2",
    name: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    lastMessage: "Hey, how are you?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    unreadCount: 2,
  },
  {
    id: "3",
    name: "Jane Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    lastMessage: "See you tomorrow!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
  },
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string>();
  const [contacts, setContacts] = useState(SAMPLE_CONTACTS);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = {
    name: "You",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=current",
  };

  const selectedContact = contacts.find(
    (contact) => contact.id === selectedContactId,
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContactId) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      timestamp: new Date(),
      isOwn: true,
      user: currentUser,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Simulate typing indicator and response
    setIsTyping(true);
    setTimeout(() => {
      const responses = [
        "That's a great point!",
        "I completely agree with you.",
        "Let me think about that...",
        "Thanks for sharing that with me.",
        "That's really interesting!",
      ];

      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)] ?? "",
        timestamp: new Date(),
        isOwn: false,
        user: {
          name: selectedContact?.name ?? "Unknown",
          avatar: selectedContact?.avatar ?? "",
        },
      };

      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAddContact = (name: string) => {
    const newContact = {
      id: (contacts.length + 1).toString(),
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.toLowerCase().replace(/\s+/g, "")}`,
      lastMessage: "New contact added",
      lastMessageTime: new Date(),
    };

    setContacts((prev) => [...prev, newContact]);
  };

  return (
    <div className="flex h-[calc(100vh-81px)]">
      {/* Contact List */}
      <div className="w-80 border-r">
        <ContactList
          contacts={contacts}
          selectedContactId={selectedContactId}
          onSelectContact={setSelectedContactId}
          onAddContact={handleAddContact}
        />
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col">
        {selectedContactId ? (
          <>
            {/* Contact Header */}
            <div className="border-b p-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={selectedContact?.avatar}
                    alt={selectedContact?.name}
                  />
                  <AvatarFallback>
                    {selectedContact?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium">{selectedContact?.name}</h2>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <EmptyState />
              ) : (
                messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))
              )}

              {isTyping && (
                <div className="animate-message-in flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={selectedContact?.avatar}
                      alt={selectedContact?.name}
                    />
                    <AvatarFallback>
                      {selectedContact?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-message-received text-message-received-foreground max-w-xs rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="bg-muted-foreground h-2 w-2 animate-bounce rounded-full"></div>
                      <div
                        className="bg-muted-foreground h-2 w-2 animate-bounce rounded-full"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="bg-muted-foreground h-2 w-2 animate-bounce rounded-full"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
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
