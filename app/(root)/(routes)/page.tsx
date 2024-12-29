import { Books } from "@/components/books";
import { Categories } from "@/components/categories";
import { Characters } from "@/components/characters/characters";
import { SearchInput } from "@/components/search-input";
import prismadb from "@/lib/prismadb";

interface RootPageProps {
  searchParams: {
    categoryId: string;
    title: string;
  };
}

const RootPage = async ({ searchParams }: RootPageProps) => {
  const data = await prismadb.book.findMany({
    where: {
      categoryId: searchParams.categoryId,
      title: {
        search: searchParams.title,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });

  const categories = await prismadb.category.findMany();
  const characters = await prismadb.character.findMany();

  return (
    <div className="h-full p-4 space-y-2">
      <SearchInput />
      <Categories data={categories} />
      <Books data={data} />
      <Characters data={characters} />
    </div>
  );
};
export default RootPage;
