import { Category } from "@prisma/client";

export enum ETheme {
  Light = "light",
  Dark = "dark",
  System = "system",
}

export interface IEpic {
  isPro: boolean;
}

export interface BotAvatarProps {
  src: string;
}

export interface ICategoriesProps {
  data: Category[];
}
