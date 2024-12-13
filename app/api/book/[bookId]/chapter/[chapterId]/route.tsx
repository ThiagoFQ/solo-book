import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { bookId: string; chapterId: string } }
) {
  try {
    const user = await currentUser();
    const { content, title, src } = await req.json();

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.bookId || !params.chapterId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Atualizar o capítulo existente
    const chapter = await prismadb.chapter.update({
      where: {
        id: params.chapterId,
      },
      data: {
        content,
        title,
        src,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { bookId: string; chapterId: string } }
) {
  try {
    const user = await currentUser();
    const { content, title, src } = await req.json();

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.bookId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Calcular a ordem para o novo capítulo
    const order =
      (await prismadb.chapter.count({
        where: {
          bookId: params.bookId,
        },
      })) + 1;

    // Criar um novo capítulo
    const chapter = await prismadb.chapter.create({
      data: {
        bookId: params.bookId,
        content,
        title,
        src,
        order: String(order),
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
