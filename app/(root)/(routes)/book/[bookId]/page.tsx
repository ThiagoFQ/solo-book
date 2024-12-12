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
    include: {
      chapters: true,
    },
  });

  const isNewBook = !params.bookId;

  const categories = await prismadb.category.findMany();

  return (
    <>
      <BookForm
        initialData={book}
        categories={categories}
        bookId={params.bookId}
        chapterMax={book?.chapterMax ?? 0}
      />
    </>
  );
};

export default BookIdPage;
