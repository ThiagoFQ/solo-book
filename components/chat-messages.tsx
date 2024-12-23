"use client";

import { ChatMessage, ChatMessageProps } from "@/components/chat-message";
import { ScrollToBottomButton } from "@/components/chat/scroll-button";
import {
  FragmentChapter,
  FragmentChapterMessage,
} from "@/components/fragments/fragment-chapter";
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
  const containerRef = useRef<ElementRef<"div">>(null);
  const nextMessageRef = useRef<HTMLDivElement | null>(null);

  const chapterContext = useChapter();
  const currentChapter = chapterContext?.currentChapter;
  const goToNextChapter = chapterContext?.goToNextChapter;

  const firstFragment =
    currentChapter?.content?.fragments?.find(
      (fragment) => fragment.chapterTitle
    ) || null;

  useEffect(() => {
    if (
      currentChapter &&
      firstFragment &&
      !messages.some((msg) => msg.fragmentId === firstFragment.fragmentId)
    ) {
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "",
          fragmentId: `chapter_${currentChapter.order}_start`,
          chapterTitle: currentChapter.title,
          chapterOrder: currentChapter.order,
          chapterImage: currentChapter.src,
        } as FragmentChapter,
        {
          role: "system",
          content: firstFragment.text,
          fragmentId: firstFragment.fragmentId,
        },
      ]);
    }
  }, [currentChapter, firstFragment]);

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

  const handleChapterEnd = (nextFragmentId: string) => {
    if (!goToNextChapter) return;
    goToNextChapter();
  };

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto pr-1 relative">
      {messages.map((message, index) => (
        <div
          key={index}
          data-message-index={index}
          ref={index === messages.length - 1 ? nextMessageRef : null}
        >
          {"chapterTitle" in message ? (
            <FragmentChapterMessage message={message as FragmentChapter} />
          ) : (
            <ChatMessage
              {...message}
              onNextFragment={handleNextFragment}
              onRollResult={handleRollResult}
              onChapterEnd={handleChapterEnd}
            />
          )}
        </div>
      ))}
      {isLoading && <ChatMessage role="system" src={book.src} isLoading />}
      <ScrollToBottomButton targetRef={containerRef} />
    </div>
  );
};
