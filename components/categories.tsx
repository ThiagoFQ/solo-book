"use client";

import { useLanguage } from "@/context/language-provider.context";
import { cn } from "@/lib/utils";
import { ICategoriesProps } from "@/types/components.types";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

export const Categories = ({ data }: ICategoriesProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const categoryId = searchParams.get("categoryId");

  const onClick = (id: string | undefined) => {
    const query = { categoryId: id };

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true }
    );

    router.push(url);
  };

  return (
    <div className="w-full overflow-x-auto space-x-2 flex p-1">
      <button
        onClick={() => onClick("characters")}
        className={cn(
          `
          flex
          items-center
          text-center
          text-xs
          md:text-sm
          px-2
          md:px-4
          py-2
          md:py-3
          rounded-md
          bg-primary/10
          hover:opacity-75
          transition
          `,
          categoryId === "characters" ? "bg-primary/25" : "bg-primary/10"
        )}
      >
        {t("character.label")}
      </button>
      <button
        onClick={() => onClick(undefined)}
        className={cn(
          `
          flex
          items-center
          text-center
          text-xs
          md:text-sm
          px-2
          md:px-4
          py-2
          md:py-3
          rounded-md
          bg-primary/10
          hover:opacity-75
          transition
          `,
          !categoryId ? "bg-primary/25" : "bg-primary/10"
        )}
      >
        {t("book.newest")}
      </button>
      <button
        onClick={() => onClick("popular")}
        className={cn(
          `
          flex
          items-center
          text-center
          text-xs
          md:text-sm
          px-2
          md:px-4
          py-2
          md:py-3
          rounded-md
          bg-primary/10
          hover:opacity-75
          transition
          `,
          categoryId === "popular" ? "bg-primary/25" : "bg-primary/10"
        )}
      >
        {t("book.mostPopular")}
      </button>
      {data.map((item) => (
        <button
          onClick={() => onClick(item.id)}
          key={item.id}
          className={cn(
            `
          flex
          items-center
          text-center
          text-xs
          md:text-sm
          px-2
          md:px-4
          py-2
          md:py-3
          rounded-md
          bg-primary/10
          hover:opacity-75
          transition
          `,
            item.id === categoryId ? "bg-primary/25" : "bg-primary/10"
          )}
        >
          {t(`categories.${item.key}`)}
        </button>
      ))}
    </div>
  );
};
