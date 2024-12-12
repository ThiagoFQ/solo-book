import prismadb from "@/lib/prismadb";
import { ChapterForm } from "../../components/chapter-form";

interface ChapterPageProps {
  params: {
    bookId: string;
    chapterId: string;
  };
}

const ChapterPage = async ({ params }: ChapterPageProps) => {
  const { chapterId, bookId } = params;

  const book = await prismadb.book.findUnique({
    where: { id: bookId },
  });

  if (!book) {
    return <div>Book not found</div>;
  }

  const chapter =
    chapterId === "new"
      ? null
      : await prismadb.chapter
          .findUnique({
            where: { id: chapterId },
          })
          .then((chapter) =>
            chapter ? { ...chapter, order: Number(chapter.order) } : chapter
          );

  if (!chapter && chapterId !== "new") {
    return <div>Chapter not found</div>;
  }

  return (
    <div>
      <ChapterForm chapter={chapter} bookId={bookId} bookTitle={book.title} />
    </div>
  );
};

export default ChapterPage;
