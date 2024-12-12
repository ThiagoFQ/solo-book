"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ChapterListProps {
  bookId: string;
  chapterMax: number;
}

export const ChapterList = ({ bookId, chapterMax }: ChapterListProps) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(chapterMax)].map((_, index) => (
        <Button
          key={index}
          variant="outline"
          onClick={() => router.push(`/book/${bookId}/chapter/${index + 1}`)}
        >
          {`Edit the Chapter ${index + 1}`}
        </Button>
      ))}
    </div>
  );
};
