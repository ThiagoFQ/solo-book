"use client";

import { BotAvatar } from "@/components/bot-avatar";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Copy, Dice5, List } from "lucide-react";
import { useTheme } from "next-themes";
import { BeatLoader } from "react-spinners";

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
  const { toast } = useToast();
  const { theme } = useTheme();

  const onCopy = () => {
    if (!content) {
      return;
    }

    navigator.clipboard.writeText(content);
    toast({
      description: "Message copied to clipboard.",
    });
  };

  const onRollDice = () => {
    const result = Math.floor(Math.random() * 20) + 1;
    toast({
      description: `You rolled a d20: ${result}`,
    });
  };

  const onShowActions = () => {
    if (actions.length === 0) {
      toast({
        description: "No actions available.",
      });
      return;
    }

    toast({
      description: `Available actions: ${actions.join(", ")}`,
    });
  };

  return (
    <div
      className={cn(
        "group flex items-start gap-x-2 py-4 w-full",
        role === "user" && "justify-end"
      )}
    >
      {role !== "user" && src && <BotAvatar src={src} />}
      <div className="rounded-md px-4 py-2 max-w-sm text-sm bg-primary/10">
        {isLoading ? (
          <BeatLoader size={5} color={theme === "light" ? "black" : "white"} />
        ) : (
          content
        )}
      </div>
      {role === "user" && <UserAvatar />}
      {role !== "user" && !isLoading && (
        <div className="flex flex-col gap-x-2 opacity-0 group-hover:opacity-100 transition">
          <Button
            onClick={onCopy}
            className="opacity-0 group-hover:opacity-100 transition"
            size="icon"
            variant="ghost"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            onClick={onRollDice}
            className="opacity-0 group-hover:opacity-100 transition"
            size="icon"
            variant="ghost"
          >
            <Dice5 className="w-4 h-4" />
          </Button>
          <Button
            onClick={onShowActions}
            className="opacity-0 group-hover:opacity-100 transition"
            size="icon"
            variant="ghost"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
