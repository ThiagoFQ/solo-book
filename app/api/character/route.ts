import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const {
      name,
      src,
      species,
      class: characterClass,
      background,
      level,
      initiative,
      armorClass,
      hitPoints,
      speed,
      strength,
      dexterity,
      constitution,
      intelligence,
      wisdom,
      charisma,
      skills,
      senses,
      languages,
      traits,
      actions,
      categoryId,
    } = body;

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name || !species || !characterClass || !background || !categoryId) {
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
    const character = await prismadb.character.create({
      data: {
        name,
        src,
        species,
        class: characterClass,
        background,
        level: level || 1,
        initiative: initiative || 0,
        armorClass: armorClass || 10,
        hitPoints: hitPoints || 10,
        speed: speed || 30,
        strength: strength || 10,
        dexterity: dexterity || 10,
        constitution: constitution || 10,
        intelligence: intelligence || 10,
        wisdom: wisdom || 10,
        charisma: charisma || 10,
        skills: skills || [],
        senses: senses || "",
        languages: languages || [],
        traits: traits || "",
        actions: actions || "",
        userId: user.id,
        categoryId,
      },
    });

    return NextResponse.json(character);
  } catch (error) {
    console.log("[Character_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
