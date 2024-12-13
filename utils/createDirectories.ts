import fs from "fs/promises";
import path from "path";

interface CreateBookDirectoriesOptions {
  bookId: string;
  languages?: string[];
}

export async function createBookDirectories({
  bookId,
  languages = ["en", "pt"],
}: CreateBookDirectoriesOptions): Promise<void> {
  const basePath = path.join(
    process.cwd(),
    "public",
    "locales",
    "books",
    bookId
  );

  try {
    // Cria a pasta principal para o livro, se não existir
    await fs.mkdir(basePath, { recursive: true });
    console.log(`Created directory for bookId: ${bookId}`);

    // Cria subdiretórios para os idiomas
    for (const language of languages) {
      const langPath = path.join(basePath, language);
      await fs.mkdir(langPath, { recursive: true });
      console.log(`Created directory for language: ${language}`);

      // Verifica ou cria o arquivo book.json vazio
      const jsonFilePath = path.join(langPath, "book.json");
      await fs.writeFile(jsonFilePath, JSON.stringify({}), "utf8");
      console.log(`Created empty book.json for ${language}`);
    }
  } catch (error) {
    console.error(`Error creating directories for bookId ${bookId}:`, error);
    throw error; // Re-throw the error if you want to handle it in the calling function
  }
}
