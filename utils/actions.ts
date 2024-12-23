import { toast } from "@/hooks/use-toast";
import { ChoiceAction, RollAction } from "@/types/actions.types";

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

export const handleChoice = (
  action: ChoiceAction,
  onNextFragment: (nextFragmentId: string, label: string) => void,
  onRollResult: (
    result: number,
    outcome: { description: string; nextFragmentId: string }
  ) => void
) => {
  if (!action || !action.options) return null;

  return action.options.map((option) => ({
    label: option.label,
    action: () => {
      if (option.nextFragmentId) {
        onNextFragment(option.nextFragmentId, option.label);
      } else if (option.roll) {
        handleRoll(option.roll, onRollResult);
      }
    },
  }));
};

export const handleRoll = (
  action: RollAction,
  onRollResult: (
    result: number,
    outcome: { description: string; nextFragmentId: string }
  ) => void
) => {
  const rollResult = Math.floor(Math.random() * 20) + 1; // Simular o d20
  const outcome =
    rollResult >= action.threshold
      ? action.outcomes.success
      : action.outcomes.failure;

  onRollResult(rollResult, outcome);
};
