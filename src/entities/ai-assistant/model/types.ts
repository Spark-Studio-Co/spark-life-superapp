export interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  isRead?: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: "image" | "document" | "audio";
  url: string;
  name?: string;
  size?: number;
}

export interface AiAssistantState {
  messages: Message[];
  isTyping: boolean;
  sendMessage: (text: string) => void;
}
