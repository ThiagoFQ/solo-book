"use client";

import { ChatForm } from "@/components/chat-form";
import { ChatHeader } from "@/components/chat-header";
import { ChatMessageProps } from "@/components/chat-message";
import { ChatMessages } from "@/components/chat-messages";
import { ChapterProvider } from "@/context/chapter-provider.context";
import { Book, Chapter, Message } from "@prisma/client";
import axios from "axios";
import { useState } from "react";

interface ChatClientProps {
  book: Book & {
    chapters: Chapter[];
    messages: Message[];
    _count: {
      messages: number;
    };
  };
}

export const ChatClient = ({ book }: ChatClientProps) => {
  const [messages, setMessages] = useState<ChatMessageProps[]>(book.messages);
  const [isLoading, setIsLoading] = useState(false);

  const addSystemMessage = async (content: string) => {
    setIsLoading(true);

    const systemMessage = {
      role: "system",
      content,
    };

    setTimeout(async () => {
      try {
        const { data: savedMessage } = await axios.post(
          `/api/book/${book.id}/message`,
          systemMessage
        );
        setMessages((current) => [...current, savedMessage]);
      } catch (error) {
        console.error("Failed to save system message:", error);
      }

      setIsLoading(false);
    }, 1000);
  };

  const userMessage: ChatMessageProps = {
    role: "user",
    content: "",
  };

  const handleInventoryClick = () => {
    userMessage.content = "You opened your inventory. [List your items here]";
    setMessages((current) => [...current, userMessage]);
  };

  const handleCharacterSheetClick = () => {
    userMessage.content =
      "You opened your character sheet. [Display character details here]";
    setMessages((current) => [...current, userMessage]);
  };

  const handleMapClick = () => {
    userMessage.content = "You opened the map. [Display map here]";
    setMessages((current) => [...current, userMessage]);
  };

  return (
    <ChapterProvider bookId={book.id}>
      <div className="flex flex-col h-full p-4 space-y-2">
        <ChatHeader book={book} />
        <ChatMessages book={book} isLoading={isLoading} messages={messages} />
        <ChatForm
          onInventoryClick={handleInventoryClick}
          onCharacterSheetClick={handleCharacterSheetClick}
          onMapClick={handleMapClick}
        />
      </div>
    </ChapterProvider>
  );
};
