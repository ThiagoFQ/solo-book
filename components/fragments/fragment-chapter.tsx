"use client";

import Image from "next/image";
import { ChatMessageProps } from "../chat-message";

export interface FragmentChapter extends ChatMessageProps {
  chapterTitle: string;
  chapterOrder: string;
  chapterImage: string;
}

export const FragmentChapterMessage = ({
  message,
}: {
  message: FragmentChapter;
}) => (
  <div className="border-b border-gray-300">
    <div className="relative w-full h-60">
      <Image
        src={message.chapterImage}
        alt={message.chapterTitle}
        fill
        className="object-cover rounded-xl"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4">
        <h2 className="text-white text-lg font-bold">{message.chapterTitle}</h2>
        <span className="text-white text-sm">{`Chapter ${message.chapterOrder}`}</span>
      </div>
    </div>
  </div>
);
