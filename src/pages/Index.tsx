import { useState, useCallback } from "react";
import { Chat, Message } from "@/types/chat";
import ChatSidebar from "@/components/ChatSidebar";
import ChatArea from "@/components/ChatArea";

const WORKER_URL = "https://restless-dawn-22da.sajjadramzan1211.workers.dev";

const createId = () => Math.random().toString(36).slice(2, 10);

const Index = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  const handleNewChat = useCallback(() => {
    const newChat: Chat = {
      id: createId(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  }, []);

  const handleSendMessage = useCallback(
    (content: string) => {
      let chatId = activeChatId;

      if (!chatId) {
        const newChat: Chat = {
          id: createId(),
          title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
          messages: [],
          createdAt: new Date(),
        };
        chatId = newChat.id;
        setChats((prev) => [newChat, ...prev]);
        setActiveChatId(chatId);
      }

      const userMsg: Message = {
        id: createId(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      setChats((prev) =>
        prev.map((c) => {
          if (c.id !== chatId) return c;
          const updated = {
            ...c,
            title: c.messages.length === 0 ? content.slice(0, 30) + (content.length > 30 ? "..." : "") : c.title,
            messages: [...c.messages, userMsg],
          };
          return updated;
        })
      );

      // Simulate AI response
      setTimeout(() => {
        const aiMsg: Message = {
          id: createId(),
          role: "ai",
          content: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
          timestamp: new Date(),
        };
        setChats((prev) =>
          prev.map((c) =>
            c.id === chatId ? { ...c, messages: [...c.messages, aiMsg] } : c
          )
        );
      }, 800);
    },
    [activeChatId]
  );

  const handleDeleteChat = useCallback(
    (id: string) => {
      setChats((prev) => prev.filter((c) => c.id !== id));
      if (activeChatId === id) setActiveChatId(null);
    },
    [activeChatId]
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />
      <ChatArea chat={activeChat} onSendMessage={handleSendMessage} />
    </div>
  );
};

export default Index;
