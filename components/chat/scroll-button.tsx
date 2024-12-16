"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

interface ScrollToBottomButtonProps {
  targetRef: React.RefObject<HTMLElement>;
}

export const ScrollToBottomButton = ({
  targetRef,
}: ScrollToBottomButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (!targetRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = targetRef.current;

    setIsVisible(scrollTop + clientHeight < scrollHeight - 20);
  };

  const scrollToBottom = () => {
    if (targetRef.current) {
      targetRef.current.scrollTo({
        top: targetRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const target = targetRef.current;

    if (target) {
      target.addEventListener("scroll", handleScroll);

      return () => {
        target.removeEventListener("scroll", handleScroll);
      };
    }
  }, [targetRef]);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-primary/60 rounded-full p-3 shadow-lg hover:bg-primary/90 transition z-50"
        >
          <ChevronDown className="h-6 w-6 text-secondary/100" />
        </button>
      )}
    </>
  );
};
