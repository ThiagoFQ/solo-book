import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BotAvatarProps } from "@/types/components.types";
import { SwordsIcon } from "lucide-react";

export const BotAvatar = ({ srcBot }: BotAvatarProps) => {
  return (
    <Avatar className={`h-12 w-12`}>
      {srcBot ? (
        <AvatarImage src={srcBot} />
      ) : (
        <AvatarFallback>
          <SwordsIcon />
        </AvatarFallback>
      )}
    </Avatar>
  );
};
