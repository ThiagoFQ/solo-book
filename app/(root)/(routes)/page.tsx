import { Books } from "@/components/books";
import { Categories } from "@/components/categories";
import { SearchInput } from "@/components/search-input";
import prismadb from "@/lib/prismadb";

interface RootPageProps {
  searchParams: {
    categoryId: string;
    name: string;
  };
}

const RootPage = async ({ searchParams }: RootPageProps) => {
  const data = await prismadb.book.findMany({
    where: {
      categoryId: searchParams.categoryId,
      title: {
        search: searchParams.name,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      chapters: {
        include: {
          messages: true,
        },
      },
    },
  });

  const booksWithMessageCounts = data.map((book) => {
    const totalMessages = book.chapters.reduce(
      (acc, chapter) => acc + chapter.messages.length,
      0
    );

    return {
      ...book,
      _count: {
        messages: totalMessages,
      },
    };
  });

  const categories = await prismadb.category.findMany();

  return (
    <div className="h-full p-4 space-y-2">
      <SearchInput />
      <Categories data={categories} />
      <Books data={booksWithMessageCounts} />
      {/*<Companions data={data} />*/}
    </div>
  );
};
export default RootPage;
