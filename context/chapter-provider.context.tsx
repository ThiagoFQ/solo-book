import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface ChapterContextType {
  currentChapter: any;
  currentOrder: number;
  goToNextChapter: () => void;
}

const ChapterContext = createContext<ChapterContextType | null>(null);

export const useChapter = () => useContext(ChapterContext);

export const ChapterProvider = ({
  bookId,
  children,
}: {
  bookId: string;
  children: ReactNode;
}) => {
  const [chapters, setChapters] = useState<{ order: string }[]>([]);
  const [currentChapter, setCurrentChapter] = useState<{
    order: string;
  } | null>(null);
  const [currentOrder, setCurrentOrder] = useState(1);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch(`/api/book/${bookId}/chapter`);
        if (!response.ok) {
          throw new Error("Failed to load chapters.");
        }
        const chaptersData = await response.json();
        setChapters(chaptersData);
        setCurrentChapter(
          chaptersData.find((ch: { order: string }) => ch.order === "1")
        );
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    fetchChapters();
  }, [bookId]);

  const goToNextChapter = () => {
    const nextChapter = chapters.find(
      (chapter) => chapter.order === String(Number(currentOrder) + 1)
    );
    if (nextChapter) {
      setCurrentChapter(nextChapter);
      setCurrentOrder((prevOrder) => prevOrder + 1);
    }
  };

  return (
    <ChapterContext.Provider
      value={{ currentChapter, currentOrder, goToNextChapter }}
    >
      {children}
    </ChapterContext.Provider>
  );
};
