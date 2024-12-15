"use client";

import { ChatMessage, ChatMessageProps } from "@/components/chat-message";
import { useChapter } from "@/context/chapter-provider.context";
import { Book } from "@prisma/client";
import { ElementRef, useEffect, useRef, useState } from "react";

interface ChatMessagesProps {
  messages: ChatMessageProps[];
  isLoading?: boolean;
  book: Book;
}

export const ChatMessages = ({
  book,
  isLoading,
  messages = [],
}: ChatMessagesProps) => {
  const scrollRef = useRef<ElementRef<"div">>(null);
  const [fakeLoading, setFakeLoading] = useState(
    messages.length === 0 ? true : false
  );

  const chapterContext = useChapter();
  const currentChapter = chapterContext?.currentChapter;
  const goToNextChapter = chapterContext?.goToNextChapter;

  const firstFragment =
    currentChapter?.content?.fragments?.find(
      (fragment) => fragment.fragmentId === "0"
    ) || null;

  console.log("AQUI", firstFragment);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFakeLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto pr-2">
      {currentChapter && (
        <div className="mb-4 p-4 border-b border-gray-300">
          <h2 className="text-m font-bold flex justify-between items-center">
            <span>{currentChapter.title}</span>
            <span>{`Chapter ${currentChapter.order}`}</span>
          </h2>
        </div>
      )}
      <ChatMessage
        isLoading={fakeLoading}
        src={book.src}
        role="system"
        content={firstFragment?.text}
      />
      {messages.map((message) => (
        <ChatMessage
          key={message.content}
          role={message.role}
          content={message.content}
          src={book.src}
        />
      ))}
      {isLoading && <ChatMessage role="system" src={book.src} isLoading />}
      <div ref={scrollRef} />
    </div>
  );
};
