"use client";

import { BotAvatar } from "@/components/bot-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { Book, Message } from "@prisma/client";
import axios from "axios";
import {
  ChevronLeft,
  Edit,
  MessagesSquare,
  MoreVertical,
  Trash,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ChatHeaderProps {
  book: Book & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
}

export const ChatHeader = ({ book }: ChatHeaderProps) => {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSmall, setIsSmall] = useState(false);

  const totalMessages = book._count.messages;

  const onDelete = async () => {
    try {
      await axios.delete(`/api/book/${book.id}`);

      toast({
        description: "Success.",
      });

      router.refresh();
      router.push("/");
    } catch (error) {
      toast({
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSmall(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const toggleImageSize = () => {
    setIsSmall((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full justify-between items-center pb-1">
        <div className="flex gap-x-2 items-center">
          <Button onClick={() => router.back()} size="icon" variant="ghost">
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <BotAvatar srcBot={undefined} />
          <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-2">
              <p className="font-bold">{book.title}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <MessagesSquare className="w-3 h-3 mr-1" />
                {totalMessages}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Created by {book.userName}
            </p>
          </div>
        </div>
        {user?.id === book.userId && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/book/${book.id}`)}>
                <Edit className="w-4 h-4 me-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete}>
                <Trash className="w-4 h-4 me-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div
        className={`relative w-full ${
          isSmall ? "h-2 bg-primary/10" : "h-60"
        } transition-all duration-300 cursor-pointer`}
        onClick={toggleImageSize}
      >
        <Image
          src={book.src}
          alt={book.title}
          fill
          className={`rounded-xl object-cover ${
            isSmall ? "opacity-10" : "opacity-100"
          } transition-opacity duration-300`}
        />
      </div>
    </div>
  );
};
