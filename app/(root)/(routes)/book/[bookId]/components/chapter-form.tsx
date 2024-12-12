"use client";

import { Book, Chapter } from "@prisma/client";

interface ChapterFormProps {
  initialData: Chapter | null;
  books: Book[];
}

export const ChapterForm = ({ books, initialData }: ChapterFormProps) => {
  return <div>ChapterForm</div>;
};
