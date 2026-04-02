import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { Chat } from "@/types/chat";
import { motion, AnimatePresence } from "framer-motion";

interface ChatSidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
}

const ChatSidebar = ({ chats, activeChatId, onSelectChat, onNewChat, onDeleteChat }: ChatSidebarProps) => {
  return (
    <div className="w-72 h-screen flex flex-col bg-[hsl(var(--sidebar-background))] border-r border-border">
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all duration-200 font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Recent</p>
        <AnimatePresence>
          {chats.map((chat) => (
            <motion.button
              key={chat.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-left ${
                activeChatId === chat.id
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span className="truncate flex-1">{chat.title}</span>
              <Trash2
                className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 hover:!opacity-100 shrink-0 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
              />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatSidebar;
