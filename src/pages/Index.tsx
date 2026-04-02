import { useState, useCallback } from "react";
import { Chat, Message } from "@/types/chat";
import ChatSidebar from "@/components/ChatSidebar";
import ChatArea from "@/components/ChatArea";

const AI_RESPONSES = [
  "That's a great question! Let me think about that for a moment. Based on my analysis, I'd suggest exploring a few different approaches to solve this effectively.",
  "I'd be happy to help with that! Here's what I recommend based on the information you've provided.",
  "Interesting! There are several ways to approach this. Let me break it down for you step by step.",
  "Great point! I've considered multiple perspectives and here's my detailed response to your query.",
  "Thanks for sharing that. Here are some insights that might help you move forward with confidence.",
];

const createId = () => Math.random().toString(36).slice(2, 10);

const Index = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

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
