"use client";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { useChapter } from "@/context/chapter-provider.context";
import { cn } from "@/lib/utils";
import { copyText, rollDice, showActions } from "@/utils/actions";
import { Copy, Dice5, List } from "lucide-react";
import { useTheme } from "next-themes";
import { BeatLoader } from "react-spinners";
import { BotAvatar } from "./bot-avatar";

export interface ChatMessageProps {
  role: "user" | "system";
  content?: string;
  isLoading?: boolean;
  src?: string;
  actions?: string[];
}

export const ChatMessage = ({
  role,
  content,
  isLoading,
  src,
  actions = [],
}: ChatMessageProps) => {
  const { theme } = useTheme();
  const chapterContext = useChapter();
  const currentChapter = chapterContext?.currentChapter;

  return (
    <div
      className={cn(
        "group flex items-start gap-x-2 py-4 w-full",
        role === "user" && "justify-end"
      )}
    >
      {role !== "user" && src && <BotAvatar src={src} />}
      <div className="rounded-md px-4 py-2 max-w-full sm:max-w-[90%] md:max-w-[75%] lg:max-w-[75%] text-m sm:text-xl bg-primary/10">
        {isLoading ? (
          <BeatLoader size={5} color={theme === "light" ? "black" : "white"} />
        ) : (
          content?.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-4 text-justify">
              {paragraph}
            </p>
          ))
        )}
      </div>
      {role === "user" && <UserAvatar />}
      {role !== "user" && !isLoading && (
        <div className="flex flex-col justify-between h-full">
          <div>
            <Button
              onClick={() => copyText(content || "")}
              className="opacity-0 group-hover:opacity-100 transition"
              size="icon"
              variant="ghost"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-col items-end gap-y-2 mt-auto">
            <Button
              onClick={rollDice}
              className="transition"
              size="icon"
              variant="ghost"
            >
              <Dice5 className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => showActions(content || "", currentChapter)}
              className="transition"
              size="icon"
              variant="ghost"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
