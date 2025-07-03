import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import type { Message } from "../types/Message";

dayjs.extend(relativeTime);

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const { text, timestamp, isOwn, user } = message;

  return (
    <div
      className={`animate-message-in flex gap-3 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
    >
      <Avatar className="mt-1 h-8 w-8">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>
          {user.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>

      <div
        className={`flex max-w-xs flex-col lg:max-w-md ${isOwn ? "items-end" : "items-start"}`}
      >
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isOwn
              ? "bg-gradient-message text-message-sent-foreground rounded-br-md"
              : "bg-message-received text-message-received-foreground rounded-bl-md"
          } `}
        >
          <p className="text-sm leading-relaxed break-words">{text}</p>
        </div>

        <div
          className={`mt-1 flex items-center gap-2 px-1 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
        >
          <span className="text-muted-foreground text-xs">
            {dayjs(timestamp).fromNow()}
          </span>
          {isOwn && (
            <div className="flex">
              <svg
                className="text-primary h-3 w-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
