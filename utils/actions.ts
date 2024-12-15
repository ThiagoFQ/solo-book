import { toast } from "@/hooks/use-toast";

// Copiar texto
export const copyText = (content: string) => {
  navigator.clipboard.writeText(content);
  toast({
    description: "Message copied to clipboard.",
  });
};

// Rolar um dado
export const rollDice = () => {
  const result = Math.floor(Math.random() * 20) + 1;
  toast({
    description: `You rolled a d20: ${result}`,
  });
};

// Exibir ações disponíveis
export const showActions = (content: string, currentChapter: any) => {
  if (!content || !currentChapter) {
    toast({
      description: "No actions available.",
    });
    return;
  }

  const fragment = currentChapter.content.fragments.find((fragment: any) =>
    content.includes(fragment.text)
  );

  if (!fragment || !fragment.actions) {
    toast({
      description: "No actions available.",
    });
    return;
  }

  const actionKeys = Object.keys(fragment.actions);
  toast({
    description: `Available actions: ${actionKeys.join(", ")}`,
  });
};
