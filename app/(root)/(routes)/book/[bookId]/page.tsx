import prismadb from "@/lib/prismadb";
import { BookForm } from "./components/book-form";

interface BookIdPageProps {
  params: {
    bookId: string;
  };
}

const BookIdPage = async ({ params }: BookIdPageProps) => {
  const book = await prismadb.book.findUnique({
    where: {
      id: params.bookId,
    },
  });

  const chapter = await prismadb.chapter.findUnique({
    where: {
      id: params.bookId,
    },
  });

  const books = await prismadb.book.findMany();
  const categories = await prismadb.category.findMany();

  return (
    <>
      <BookForm initialData={book} categories={categories} />
      {/*<Separator className="bg-primary/10" />
      <ChapterForm initialData={chapter} books={books} />*/}
    </>
  );
};

export default BookIdPage;
