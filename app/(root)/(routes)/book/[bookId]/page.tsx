import prismadb from "@/lib/prismadb";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { BookForm } from "./components/book-form";

interface BookIdPageProps {
  params: {
    bookId: string;
  };
}

const BookIdPage = async ({ params }: BookIdPageProps) => {
  const { userId } = auth();

  // TODO: Check subscription

  if (!userId) {
    return redirectToSignIn();
  }

  const book = await prismadb.book.findUnique({
    where: {
      id: params.bookId,
      userId,
    },
    include: {
      chapters: true,
    },
  });

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
