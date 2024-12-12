"use client";

import { Separator } from "@/components/ui/separator";
import { Book, Chapter } from "@prisma/client";

interface ChapterFormProps {
  initialData: Chapter | null;
  books: Book[];
}

export const ChapterForm = ({ books, initialData }: ChapterFormProps) => {
  return (
    <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
      <Separator className="bg-primary/10" />

      <div>ChapterForm</div>
    </div>
  );
};
