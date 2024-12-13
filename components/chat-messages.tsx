"use client";

import { ChatMessage, ChatMessageProps } from "@/components/chat-message";
import { useChapter } from "@/context/chapter-provider.context";
import i18n, { loadBookTranslations } from "@/lib/i18n";
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
  const [translationsLoaded, setTranslationsLoaded] = useState(false);

  const chapterContext = useChapter();
  const currentChapter = chapterContext ? chapterContext.currentChapter : null;

  // Carregar traduções do livro
  useEffect(() => {
    const loadTranslations = async () => {
      const translations = await loadBookTranslations(book.id, i18n.locale);
      if (translations) {
        setTranslationsLoaded(true);
      }
    };
    loadTranslations();
  }, [book.id, i18n.locale]);

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

  const pathMessage = currentChapter?.content
    ? JSON.parse(currentChapter.content).fragments.find(
        (fragment: { fragmentId: string }) => fragment.fragmentId === "0"
      )?.textKey
    : null;

  let initialMessage = "Loading translations...";
  if (translationsLoaded && pathMessage) {
    initialMessage = i18n.t(`${book.id}.${pathMessage}`, {
      defaultValue: "Translation not found",
    });
  }

  return (
    <div className="flex-1 overflow-y-auto pr-4">
      <ChatMessage
        isLoading={fakeLoading}
        src={book.src}
        role="system"
        content={initialMessage}
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
