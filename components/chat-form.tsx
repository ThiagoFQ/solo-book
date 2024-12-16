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
    <div className="border-t border-primary/10 py-4 flex items-center justify-around gap-x-6 mr-1">
      <Button
        variant="ghost"
        onClick={onCharacterSheetClick}
        className="flex flex-col items-center"
      >
        <div className="flex items-center justify-center w-12 h-12">
          <User className="w-10 h-10" />
        </div>
        <span className="text-xs mt-1">Character</span>
      </Button>
      <Button
        variant="ghost"
        onClick={onInventoryClick}
        className="flex flex-col items-center"
      >
        <div className="flex items-center justify-center w-12 h-12">
          <Backpack className="w-10 h-10" />
        </div>
        <span className="text-xs mt-1">Inventory</span>
      </Button>
      <Button
        variant="ghost"
        onClick={onMapClick}
        className="flex flex-col items-center"
      >
        <div className="flex items-center justify-center w-12 h-12">
          <Map className="w-10 h-10" />
        </div>
        <span className="text-xs mt-1">Map</span>
      </Button>
    </div>
  );
};
