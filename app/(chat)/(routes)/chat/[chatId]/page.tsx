import prismadb from "@/lib/prismadb";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ChatClient } from "./components/client";

interface ChatIdPageProps {
  params: {
    chatId: string;
  };
}

const ChatIdPage = async ({ params }: ChatIdPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const book = await prismadb.book.findUnique({
    where: {
      id: params.chatId,
    },
    include: {
      chapters: {
        include: {
          messages: true,
        },
      },
      _count: {
        select: {
          chapters: true,
        },
      },
    },
  });

  if (!book) {
    return redirect("/");
  }

  return <ChatClient book={book} />;
};

export default ChatIdPage;
