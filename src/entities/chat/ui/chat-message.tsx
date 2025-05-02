import { Avatar } from "@/components/ui/avatar";

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
}

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
}

export default function ChatMessage({
  message,
  isOwnMessage,
}: ChatMessageProps) {
  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] ${isOwnMessage ? "order-2" : "order-1"}`}>
        {!isOwnMessage && (
          <div className="mb-1 flex items-center">
            <Avatar className="mr-2 h-6 w-6 text-xs">
              <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                {message.sender
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            </Avatar>
            <span className="text-xs font-medium">{message.sender}</span>
          </div>
        )}

        <div className="flex">
          <div
            className={`rounded-2xl px-4 py-2 text-sm ${
              isOwnMessage
                ? "rounded-tr-sm bg-primary text-primary-foreground"
                : "rounded-tl-sm bg-secondary text-secondary-foreground"
            }`}
          >
            {message.content}
          </div>
        </div>

        <div className={`mt-1 text-right text-xs text-muted-foreground`}>
          {message.time}
        </div>
      </div>
    </div>
  );
}
