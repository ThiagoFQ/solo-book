"use client";

import i18n, { changeLanguage } from "@/lib/i18n";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface LanguageContextProps {
  t: (key: string) => string;
  currentLanguage: string;
  setLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.locale);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || i18n.locale;
    changeLanguage(savedLanguage);
    setCurrentLanguage(savedLanguage);
  }, []);

  const setLanguage = (language: string) => {
    changeLanguage(language);
    setCurrentLanguage(language);
  };

  const t = useMemo(() => i18n.t.bind(i18n), [currentLanguage]);

  return (
    <LanguageContext.Provider value={{ t, currentLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
