import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

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

    return NextResponse.json(book);
  } catch (error) {
    console.log("[BOOK_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
