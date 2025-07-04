import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAuth } from "~/features/auth/hooks/useAuth";

dayjs.extend(relativeTime);

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    senderId: string;
    sentAt: Date;
    readAt?: Date | null;
  };
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const { content, sentAt, senderId, readAt } = message;
  const { user } = useAuth();
  const isOwn = senderId === user?.id;

  return (
    <div
      className={`group flex w-full gap-1 ${
        isOwn ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* <Avatar className="mt-1 h-8 w-8">
        <AvatarImage src={user?.imageUrl ?? ""} alt={user?.name ?? ""} />
        <AvatarFallback>{user?.?.split(" ")[0]}</AvatarFallback>
      </Avatar> */}

      <div
        className={`flex max-w-[75%] flex-col ${
          isOwn ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-2xl px-3 py-2 shadow-sm ${
            isOwn
              ? "bg-gradient-message text-message-sent-foreground rounded-br-sm"
              : "bg-message-received text-message-received-foreground rounded-bl-sm"
          }`}
        >
          <p className="text-[15px] leading-relaxed break-words">{content}</p>
        </div>

        <div
          className={`mt-0.5 flex items-center gap-1 px-0.5 opacity-60 transition-opacity group-hover:opacity-100 ${
            isOwn ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <span className="text-muted-foreground text-[10px]">
            {dayjs(sentAt).fromNow()}
          </span>
          {isOwn && readAt && (
            <div className="flex">
              <svg
                className="text-primary h-2.5 w-2.5"
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
