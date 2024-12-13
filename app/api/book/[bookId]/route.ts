import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs";
import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

export async function PATCH(
  req: Request,
  { params }: { params: { bookId: string } }
) {
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

    if (!params.bookId) {
      return new NextResponse("Companion ID is required", { status: 401 });
    }

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
    }
*/
    const book = await prismadb.book.update({
      where: {
        id: params.bookId,
        userId: user.id,
      },
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

    const basePath = path.join(
      process.cwd(),
      "locales",
      "books",
      params.bookId
    );
    const languages = ["en", "pt"];

    for (const lang of languages) {
      const filePath = path.join(basePath, lang, "book.json");

      if (fs.existsSync(filePath)) {
        const bookData = JSON.parse(fs.readFileSync(filePath, "utf8"));
        bookData.title = title;
        bookData.description = description;

        fs.writeFileSync(filePath, JSON.stringify(bookData, null, 2), "utf8");
      }
    }

    return NextResponse.json(book);
  } catch (error) {
    console.log("[BOOK_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { bookId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const book = await prismadb.book.delete({
      where: {
        userId,
        id: params.bookId,
      },
    });

    const basePath = path.join(
      process.cwd(),
      "locales",
      "books",
      params.bookId
    );

    if (fs.existsSync(basePath)) {
      fs.rmSync(basePath, { recursive: true, force: true });
      console.log(`Deleted directory for bookId: ${params.bookId}`);
    }

    return NextResponse.json(book);
  } catch (error) {
    console.log("[BOOK_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
