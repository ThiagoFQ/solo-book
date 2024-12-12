import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Chapter } from "@prisma/client";
import { Bookmark, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ChaptersProps {
  bookId: string;
  chapters: Chapter[];
  chapterMax: number;
}

export const Chapters = ({ bookId, chapters, chapterMax }: ChaptersProps) => {
  const placeholders = [...Array(chapterMax - chapters.length)].map((_, i) => ({
    id: `placeholder-${i}`,
    order: chapters.length + i + 1,
  }));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {chapters.map((chapter) => (
        <Card
          key={chapter.id}
          className="bg-primary/10 rounded-xl cursor-pointer hover:opacity-75 transition border-0"
        >
          <Link href={`/book/${bookId}/chapters/${chapter.id}`}>
            <CardHeader className="flex items-center justify-center text-center text-muted-foreground">
              <div className="relative w-32 h-32">
                <Image
                  src={chapter.src || "/placeholder.svg"}
                  fill
                  className="rounded-xl object-cover"
                  alt={`Chapter ${chapter.title}`}
                />
              </div>
              <p className="font-bold truncate">{chapter.title}</p>
              <p className="text-xs truncate">
                {chapter.content?.slice(0, 50)}...
              </p>
            </CardHeader>
            <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center">
                <Bookmark className="w-3 h-3 mr-1" />
                Order: {chapter.order || "N/A"}
              </div>
              <div className="flex items-center">
                <FileText className="w-3 h-3 mr-1" />
                {chapter.content?.length || 0} chars
              </div>
            </CardFooter>
          </Link>
        </Card>
      ))}

      {placeholders.map((placeholder) => (
        <Card
          key={placeholder.id}
          className="bg-muted/10 rounded-xl cursor-pointer hover:opacity-75 transition border-dashed"
        >
          <Link
            href={`/book/${bookId}/chapters/new?order=${placeholder.order}`}
          >
            <CardHeader className="flex flex-col items-center justify-center text-center text-muted-foreground space-y-2">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <Image
                  src="/placeholder.svg"
                  fill
                  className="rounded-xl object-cover"
                  alt={`Placeholder for Chapter ${placeholder.order}`}
                />
              </div>
              <p className="font-bold">Add Chapter {placeholder.order}</p>
            </CardHeader>
          </Link>
        </Card>
      ))}
    </div>
  );
};
