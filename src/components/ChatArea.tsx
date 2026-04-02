import { useRef, useEffect } from "react";
import { Download, Sparkles } from "lucide-react";
import { Chat } from "@/types/chat";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { motion } from "framer-motion";

interface ChatAreaProps {
  chat: Chat | null;
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}

const ChatArea = ({ chat, onSendMessage, isLoading }: ChatAreaProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages.length]);

  const handleDownload = () => {
    if (!chat) return;
    const text = chat.messages
      .map((m) => `[${m.role.toUpperCase()}] ${m.content}`)
      .join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${chat.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border">
        <h2 className="text-sm font-medium text-foreground truncate">
          {chat?.title || "Fusion AI"}
        </h2>
        {chat && chat.messages.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-all duration-200"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </motion.button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {!chat || chat.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gradient-orange to-gradient-blue flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-foreground" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Start your conversation</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Ask anything and let Fusion AI assist you with your tasks.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {chat.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="max-w-3xl mx-auto w-full">
        <ChatInput onSend={onSendMessage} />
      </div>
    </div>
  );
};

export default ChatArea;
