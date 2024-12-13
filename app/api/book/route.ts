import prismadb from "@/lib/prismadb";
import { createBookDirectories } from "@/utils/createDirectories";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const {
      src,
      title,
      description,
      chapterMax,
      levelMin,
      levelMax,
      categoryId,
    } = body;

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (
      !src ||
      !title ||
      !description ||
      !chapterMax ||
      !levelMin ||
      !levelMax ||
      !categoryId
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    /*
    const isPro = await checkSubscription();

    if (!isPro) {
      return new NextResponse("Pro subscription required", {
        status: 403,
      });
    }*/

    const book = await prismadb.book.create({
      data: {
        title: title,
        categoryId,
        userId: user.id,
        userName: user.firstName,
        src,
        description,
        chapterMax,
        levelMin,
        levelMax,
      },
    });

    await createBookDirectories({ bookId: book.id, languages: ["en", "pt"] });
    return NextResponse.json(book);
  } catch (error) {
    console.log("[BOOK_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
