const { PrismaClient } = require("@prisma/client");
const translations = require("../lib/locales/en/common.json");

const db = new PrismaClient();

async function main() {
  try {
    const categories = Object.entries(translations.categories).map(
      ([key, name]) => ({
        key,
        name,
      })
    );

    await db.category.createMany({
      data: categories,
    });

    console.log("Categories seeded successfully:", categories);
  } catch (error) {
    console.error("Error seeding default categories", error);
  } finally {
    await db.$disconnect();
  }
}

main();
