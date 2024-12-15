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
  messages: initialMessages,
}: ChatMessagesProps) => {
  const [messages, setMessages] = useState<ChatMessageProps[]>(initialMessages);
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
    // Adicionar o fragmento inicial às mensagens apenas uma vez
    if (
      firstFragment &&
      !messages.some((msg) => msg.fragmentId === firstFragment.fragmentId)
    ) {
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: firstFragment.text,
          fragmentId: firstFragment.fragmentId,
        },
      ]);
    }
  }, [firstFragment, messages]);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleNextFragment = (nextFragmentId: string, label: string) => {
    if (!currentChapter) return;

    const nextFragment = currentChapter.content.fragments.find(
      (fragment: any) => fragment.fragmentId === nextFragmentId
    );

    if (nextFragment) {
      setMessages((prev) => [
        // Atualiza mensagens existentes para esconder actions
        ...prev.map((msg) =>
          msg.role === "system" ? { ...msg, isHidden: true } : msg
        ),
        {
          role: "user",
          content: `${label} (Go to ${nextFragmentId})`, // Mensagem do usuário
        },
        {
          role: "system",
          content: nextFragment.text,
          fragmentId: nextFragmentId,
          isHidden: false, // Actions visíveis apenas na nova mensagem
        },
      ]);
    }
  };

  const handleRollResult = (
    result: number,
    outcome: { description: string; nextFragmentId: string }
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "system",
        content: `Roll Result: ${result} (${outcome.description})`,
      },
    ]);

    handleNextFragment(outcome.nextFragmentId, outcome.description);
  };

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
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          {...message}
          onNextFragment={handleNextFragment}
          onRollResult={handleRollResult}
        />
      ))}
      {isLoading && <ChatMessage role="system" src={book.src} isLoading />}
      <div ref={scrollRef} />
    </div>
  );
};
