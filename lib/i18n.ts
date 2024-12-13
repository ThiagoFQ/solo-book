import { I18n } from "i18n-js";

// Traduções padrão (comuns)
export const translations = {
  en: require("./locales/en/common.json"),
  pt: require("./locales/pt/common.json"),
};

const i18n = new I18n(translations);

i18n.locale = "en";
i18n.enableFallback = true;

// Idiomas disponíveis
export const availableLanguages = [
  { code: "en", label: "English" },
  { code: "pt", label: "Português" },
];

// Alterar idioma
export const changeLanguage = (language: string) => {
  i18n.locale = language;
  localStorage.setItem("language", language);
};

// Função para carregar traduções de livros dinamicamente
export const loadBookTranslations = async (
  bookId: string,
  language: string
) => {
  try {
    const response = await fetch(
      `/locales/books/${bookId}/${language}/book.json`
    );
    if (!response.ok) {
      throw new Error("Failed to load book translations");
    }
    const bookTranslations = await response.json();
    i18n.store({ [language]: { [bookId]: bookTranslations } });
    return bookTranslations;
  } catch (error) {
    console.error(
      `Error loading translations for bookId: ${bookId}, language: ${language}`,
      error
    );
    return null;
  }
};

export default i18n;
