"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-provider.context";
import { cn } from "@/lib/utils";
import { ICategoriesProps } from "@/types/components.types";
import { BookIcon, StarIcon, TimerIcon, UserIcon } from "lucide-react";
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
      <Button
        onClick={() => onClick("characters")}
        variant={"secondary"}
        size={"icon"}
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
        <UserIcon className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => onClick(undefined)}
        variant={"secondary"}
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
        <TimerIcon className="w-4 h-4 mr-1" />
        {t("book.newest")}
      </Button>
      <Button
        onClick={() => onClick("popular")}
        variant={"secondary"}
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
        <StarIcon className="w-4 h-4 mr-1" />
        {t("book.mostPopular")}
      </Button>
      {data.map((item) => (
        <Button
          onClick={() => onClick(item.id)}
          variant={"secondary"}
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
          <BookIcon className="w-4 h-4 mr-1" />
          {t(`categories.${item.key}`)}
        </Button>
      ))}
    </div>
  );
};
