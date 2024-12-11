import { I18n } from "i18n-js";

export const translations = {
  en: require("./locales/en/common.json"),
  pt: require("./locales/pt/common.json"),
};

const i18n = new I18n(translations);

i18n.locale = "en";

i18n.enableFallback = true;

export const availableLanguages = [
  { code: "en", label: "English" },
  { code: "pt", label: "Português" },
];

export const changeLanguage = (language: string) => {
  i18n.locale = language;
  localStorage.setItem("language", language);
};

export default i18n;
