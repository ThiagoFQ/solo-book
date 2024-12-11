"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/language-provider.context";
import { availableLanguages } from "@/lib/i18n";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="flex items-center gap-2"
        >
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="text-sm font-medium">
            {currentLanguage.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLanguages.map((language: { code: string; label: string }) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => setLanguage(language.code)}
          >
            {language.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
