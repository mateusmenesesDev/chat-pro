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
import { EmptyState } from "~/features/chat/components/EmptyState";
import { MessageBubble } from "~/features/chat/components/MessageBubble";
import type { Message } from "~/features/chat/types/Message";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = {
    name: "You",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=current",
  };

  const aiUser = {
    name: "ChatPro",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

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
        user: aiUser,
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

  return (
    <div className="flex h-[calc(100vh-81px)] flex-col">
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
              <AvatarImage src={aiUser.avatar} alt={aiUser.name} />
              <AvatarFallback>
                {aiUser.name
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
    </div>
  );
}
