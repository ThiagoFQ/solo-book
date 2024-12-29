import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { characterId: string } }
) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { src, name, description, instructions, seed, categoryId } = body;

    if (!params.characterId) {
      return new NextResponse("Character ID is required", { status: 401 });
    }

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (
      !src ||
      !name ||
      !description ||
      !instructions ||
      !seed ||
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
    const character = await prismadb.character.update({
      where: {
        id: params.characterId,
        userId: user.id,
      },
      data: {
        name: name,
        categoryId,
        userId: user.id,
      },
    });

    return NextResponse.json(character);
  } catch (error) {
    console.log("[CHARACTER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { characterId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const character = await prismadb.character.delete({
      where: {
        userId,
        id: params.characterId,
      },
    });

    return NextResponse.json(character);
  } catch (error) {
    console.log("[CHARACTER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
