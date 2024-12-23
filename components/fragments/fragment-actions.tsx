"use client";

import { Button } from "@/components/ui/button";
import { useChapter } from "@/context/chapter-provider.context";
import { handleChoice, handleRoll } from "@/utils/actions";

interface FragmentActionsProps {
  fragmentId: string;
  onNextFragment: (nextFragmentId: string, label: string) => void;
  onChapterEnd: (nextFragmentId: string) => void;
  onRollResult: (
    result: number,
    outcome: { description: string; nextFragmentId: string }
  ) => void;
}

export const FragmentActions = ({
  fragmentId,
  onNextFragment,
  onChapterEnd,
  onRollResult,
}: FragmentActionsProps) => {
  const chapterContext = useChapter();
  const currentChapter = chapterContext?.currentChapter;

  if (!currentChapter) return null;

  const fragment = currentChapter.content.fragments.find(
    (fragment: any) => fragment.fragmentId === fragmentId
  );

  if (!fragment || !fragment.actions) return null;

  const handleNext = (nextFragmentId: string, label: string) => {
    if (fragment.chapterEnd) {
      onChapterEnd(nextFragmentId);
    } else {
      onNextFragment(nextFragmentId, label);
    }
  };

  const choices = fragment.actions.choice
    ? handleChoice(fragment.actions.choice, handleNext, onRollResult)
    : null;

  return (
    <div className="flex flex-col gap-2 mt-2">
      {choices && (
        <div>
          {choices.length > 1 && <h3>Make a Choice:</h3>}
          {choices.map((choice) => (
            <Button
              key={choice.label}
              size="sm"
              variant="outline"
              onClick={choice.action}
              className="flex flex-col mt-2"
            >
              {choice.label}
            </Button>
          ))}
        </div>
      )}
      {fragment.actions.roll && (
        <div>
          <h3>Roll for {fragment.actions.roll.skill}:</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleRoll(fragment?.actions?.roll!, onRollResult)}
          >
            Roll (DC {fragment.actions.roll.threshold})
          </Button>
        </div>
      )}
    </div>
  );
};
