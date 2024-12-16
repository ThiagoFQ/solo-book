"use client";

import { ChatMessage, ChatMessageProps } from "@/components/chat-message";
import { useChapter } from "@/context/chapter-provider.context";
import { Book } from "@prisma/client";
import { ElementRef, useEffect, useRef, useState } from "react";
import { ScrollToBottomButton } from "./chat/scroll-button";

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
  const containerRef = useRef<ElementRef<"div">>(null);
  const nextMessageRef = useRef<HTMLDivElement | null>(null);

  const chapterContext = useChapter();
  const currentChapter = chapterContext?.currentChapter;
  const goToNextChapter = chapterContext?.goToNextChapter;

  const firstFragment =
    currentChapter?.content?.fragments?.find(
      (fragment) => fragment.fragmentId === "0"
    ) || null;

  useEffect(() => {
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
  }, [firstFragment, messages, currentChapter]);

  useEffect(() => {
    if (nextMessageRef.current) {
      nextMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      nextMessageRef.current = null;
    }
  }, [messages]);

  const handleNextFragment = (nextFragmentId: string, label: string) => {
    if (!currentChapter) return;

    const nextFragment = currentChapter.content.fragments.find(
      (fragment: any) => fragment.fragmentId === nextFragmentId
    );

    if (nextFragment) {
      setMessages((prev) => {
        const updatedMessages: ChatMessageProps[] = [
          ...prev.map((msg) =>
            msg.role === "system" ? { ...msg, isHidden: true } : msg
          ),
          /*
          {
            role: "user",
            content: `${label} (Go to ${nextFragmentId})`,
            fragmentId: undefined,
            isHidden: undefined,
          },
          */
          {
            role: "system",
            content: nextFragment.text,
            fragmentId: nextFragmentId,
            isHidden: false,
          },
        ];

        setTimeout(() => {
          nextMessageRef.current = document.querySelector(
            `[data-message-index="${updatedMessages.length - 1}"]`
          );
        }, 0);

        return updatedMessages;
      });
    }
  };

  const handleRollResult = (
    result: number,
    outcome: { description: string; nextFragmentId: string }
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: `Roll Result: ${result}.\n(${outcome.description})`,
      },
    ]);

    handleNextFragment(outcome.nextFragmentId, outcome.description);
  };

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto pr-1 relative">
      {currentChapter && (
        <div className="mb-4 p-4 border-b border-gray-300">
          <h2 className="text-m font-bold flex justify-between items-center">
            <span>{currentChapter.title}</span>
            <span>{`Chapter ${currentChapter.order}`}</span>
          </h2>
        </div>
      )}
      {messages.map((message, index) => (
        <div
          key={index}
          data-message-index={index}
          ref={index === messages.length - 1 ? nextMessageRef : null}
        >
          <ChatMessage
            {...message}
            onNextFragment={handleNextFragment}
            onRollResult={handleRollResult}
          />
        </div>
      ))}
      {isLoading && <ChatMessage role="system" src={book.src} isLoading />}
      <ScrollToBottomButton targetRef={containerRef} />
    </div>
  );
};
