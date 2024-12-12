"use client";

import { ChatForm } from "@/components/chat-form";
import { ChatHeader } from "@/components/chat-header";
import { ChatMessageProps } from "@/components/chat-message";
import { ChatMessages } from "@/components/chat-messages";
import { Book } from "@prisma/client";
import { useCompletion } from "ai/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface ChatClientProps {
  book: Book & {
    chapters: {
      id: string;
      title: string;
      order: string;
      messages: {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        role: "user" | "system";
        content: string;
        chapterId: string;
      }[];
    }[];
    _count: {
      chapters: number;
    };
  };
}

export const ChatClient = ({ book }: ChatClientProps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageProps[]>(
    book.chapters.flatMap((chapter) =>
      chapter.messages.map((message) => ({
        role: message.role,
        content: message.content,
      }))
    )
  );

  const { input, isLoading, handleInputChange, handleSubmit, setInput } =
    useCompletion({
      api: `/api/chat/${book.id}`,
      onFinish(_prompt, completion) {
        const systemMessage: ChatMessageProps = {
          role: "system",
          content: completion,
        };

        setMessages((current) => [...current, systemMessage]);
        setInput("");

        router.refresh();
      },
    });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userMessage: ChatMessageProps = {
      role: "user",
      content: input,
    };

    setMessages((current) => [...current, userMessage]);

    handleSubmit(e);
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      <ChatHeader book={book} />
      <ChatMessages book={book} isLoading={isLoading} messages={messages} />
      <ChatForm
        isLoading={isLoading}
        input={input}
        handleInputChange={handleInputChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};
