import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface Chapter {
  id: string;
  userId: string;
  title: string;
  content: Content;
  src: string;
  order: string;
  bookId: string;
  createdAt: string;
  updatedAt: string;
}

interface Content {
  fragments: Fragment[];
}

interface Fragment {
  fragmentId: string;
  chapterTitle: string;
  chapterEnd: boolean;
  text: string;
  actions?: {
    choice?: {
      options: {
        label: string;
        nextFragmentId: string;
      }[];
    };
    roll?: {
      stat: string;
      skill: string;
      outcomes: {
        success: {
          description: string;
          nextFragmentId: string;
        };
        failure: {
          description: string;
          nextFragmentId: string;
        };
      };
      threshold: number;
    };
    inspiration?: {
      type: string;
    };
  };
}

interface ChapterContextType {
  currentChapter: Chapter | null;
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
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [currentOrder, setCurrentOrder] = useState(1);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch(`/api/book/${bookId}/chapter`);
        if (!response.ok) {
          throw new Error("Failed to load chapters.");
        }

        const chaptersData: Chapter[] = await response.json();

        // Ordenar os capítulos por `order`
        const sortedChapters = chaptersData.sort(
          (a, b) => Number(a.order) - Number(b.order)
        );

        setChapters(sortedChapters);

        // Definir o capítulo inicial (order === "1")
        const initialChapter =
          sortedChapters.find((ch) => ch.order === "1") || sortedChapters[0]; // Caso o order === "1" não exista
        setCurrentChapter(initialChapter || null);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    fetchChapters();
  }, [bookId]);

  const goToNextChapter = () => {
    const nextChapter = chapters.find(
      (chapter) => Number(chapter.order) === currentOrder + 1
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
