import { Sidebar } from "@/components/sidebar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { checkSubscription } from "@/lib/subscription";
import { Menu } from "lucide-react";

export const MobileSidebar = async () => {
  const isPro = await checkSubscription();

  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-secondary pt-10 w-32">
        <SheetTitle className="sr-only">Mobile Sidebar</SheetTitle>
        <Sidebar isPro={isPro} />
      </SheetContent>
    </Sheet>
  );
};
