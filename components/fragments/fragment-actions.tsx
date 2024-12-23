"use client";

import { Button } from "@/components/ui/button";
import { useChapter } from "@/context/chapter-provider.context";
import { handleRoll } from "@/utils/actions";

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

  return (
    <div className="flex flex-col gap-2 mt-2">
      {fragment.actions.choice && (
        <div>
          {fragment.actions.choice.options.length > 1 && (
            <h3>Make a Choice:</h3>
          )}
          {fragment.actions.choice.options.map((option) => (
            <Button
              key={option.nextFragmentId}
              size="sm"
              variant="outline"
              onClick={() => handleNext(option.nextFragmentId, option.label)}
              className="flex flex-col mt-2"
            >
              {option.label}
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
