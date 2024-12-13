import fs from "fs";
import path from "path";

interface CreateBookDirectoriesOptions {
  bookId: string;
  languages?: string[];
}

export async function createBookDirectories({
  bookId,
  languages = ["en", "pt"],
}: CreateBookDirectoriesOptions): Promise<void> {
  const basePath = path.join(process.cwd(), "locales", "books", bookId);

  // Cria a pasta principal para o livro, se não existir
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
    console.log(`Created directory for bookId: ${bookId}`);
  }

  // Cria subdiretórios para os idiomas
  languages.forEach((language: string) => {
    const langPath = path.join(basePath, language);

    if (!fs.existsSync(langPath)) {
      fs.mkdirSync(langPath, { recursive: true });
      console.log(`Created directory for language: ${language}`);
    }

    // Verifica ou cria o arquivo book.json vazio
    const jsonFilePath = path.join(langPath, "book.json");
    if (!fs.existsSync(jsonFilePath)) {
      fs.writeFileSync(jsonFilePath, JSON.stringify({}), "utf8");
      console.log(`Created empty book.json for ${language}`);
    }
  });
}
