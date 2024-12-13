"use client";

import { Button } from "@/components/ui/button";
import { Backpack, Map, User } from "lucide-react";

interface ChatFormProps {
  onInventoryClick: () => void;
  onCharacterSheetClick: () => void;
  onMapClick: () => void;
}

export const ChatForm = ({
  onInventoryClick,
  onCharacterSheetClick,
  onMapClick,
}: ChatFormProps) => {
  return (
    <div className="border-t border-primary/10 py-4 flex items-center justify-around gap-x-4">
      <Button
        variant="ghost"
        onClick={onCharacterSheetClick}
        className="flex flex-col items-center"
      >
        <User className="w-12 h-12" />
        <span className="text-xs mt-1">Character</span>
      </Button>
      <Button
        variant="ghost"
        onClick={onInventoryClick}
        className="flex flex-col items-center"
      >
        <Backpack className="w-12 h-12" />
        <span className="text-xs mt-1">Inventory</span>
      </Button>
      <Button
        variant="ghost"
        onClick={onMapClick}
        className="flex flex-col items-center"
      >
        <Map className="w-12 h-12" />
        <span className="text-xs mt-1">Map</span>
      </Button>
    </div>
  );
};
