import { useState, useCallback } from "react";
import { Chat, Message } from "@/types/chat";
import ChatSidebar from "@/components/ChatSidebar";
import ChatArea from "@/components/ChatArea";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const WORKER_URL = "https://restless-dawn-22da.sajjadramzan1211.workers.dev";

const createId = () => Math.random().toString(36).slice(2, 10);

const Index = () => {
  const [chats, setChats] = useLocalStorage<Chat[]>("chats", []);
  const [activeChatId, setActiveChatId] = useLocalStorage<string | null>("activeChatId", null);
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
    async (content: string) => {
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
            title:
              c.messages.length === 0
                ? content.slice(0, 30) + (content.length > 30 ? "..." : "")
                : c.title,
            messages: [...c.messages, userMsg],
          };
          return updated;
        }),
      );

      // Call Cloudflare Worker
      setIsLoading(true);
      try {
        const res = await fetch(WORKER_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: content }),
        });
        const data = await res.json();
        const aiText =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Sorry, I couldn't generate a response.";
        const html = marked(aiText) as string;
        const safeHtml = DOMPurify.sanitize(html);
        const aiMsg: Message = {
          id: createId(),
          role: "ai",
          content: safeHtml,
          timestamp: new Date(),
        };
        setChats((prev) =>
          prev.map((c) =>
            c.id === chatId ? { ...c, messages: [...c.messages, aiMsg] } : c,
          ),
        );
      } catch {
        const errMsg: Message = {
          id: createId(),
          role: "ai",
          content: "Sorry, something went wrong. Please try again.",
          timestamp: new Date(),
        };
        setChats((prev) =>
          prev.map((c) =>
            c.id === chatId ? { ...c, messages: [...c.messages, errMsg] } : c,
          ),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [activeChatId],
  );

  const handleDeleteChat = useCallback(
    (id: string) => {
      setChats((prev) => prev.filter((c) => c.id !== id));
      if (activeChatId === id) setActiveChatId(null);
    },
    [activeChatId],
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
      <ChatArea
        chat={activeChat}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Index;
