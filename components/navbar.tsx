"use client";

import { MobileSidebar } from "@/components/mobile-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-provider.context";
import { useProModal } from "@/hooks/use-pro-modal";
import { cn } from "@/lib/utils";
import { IEpic } from "@/types/components";
import { UserButton } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { LanguageToggle } from "./language-toggle";

const font = Poppins({
  weight: "600",
  subsets: ["latin"],
});

export default function Navbar({ isPro }: IEpic) {
  const { t } = useLanguage();
  const proModal = useProModal();

  return (
    <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary h-16">
      <div className="flex items-center">
        <MobileSidebar isPro={isPro} />
        <Link href="/">
          <h1
            className={cn(
              "hidden md:block text-xl md:text-3xl font-bold text-primary",
              font.className
            )}
          >
            solo.book
          </h1>
        </Link>
      </div>
      <div className="flex items-center gap-x-3">
        {!isPro && (
          <Button onClick={proModal.onOpen} variant={"premium"} size={"sm"}>
            {t("button.levelUp")}
            <Sparkles className="h-4 w-4 fill-white text-white ml-2" />
          </Button>
        )}
        <ModeToggle />
        <LanguageToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}
