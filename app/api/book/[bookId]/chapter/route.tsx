import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { bookId: string } }
) {
  const { bookId } = params;

  if (!bookId) {
    return new NextResponse("Missing bookId", { status: 400 });
  }

  const chapters = await prismadb.chapter.findMany({
    where: { bookId },
    orderBy: { order: "asc" },
  });

  if (!chapters.length) {
    return new NextResponse("No chapters found", { status: 404 });
  }

  return NextResponse.json(chapters);
}
