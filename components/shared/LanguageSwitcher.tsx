"use client";

import { useLanguage } from "./LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 text-sm">
      <button
        onClick={() => setLanguage("sw")}
        className={`px-2 py-1 rounded font-medium transition-colors ${
          language === "sw"
            ? "bg-primary-600 text-white"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        SW
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`px-2 py-1 rounded font-medium transition-colors ${
          language === "en"
            ? "bg-primary-600 text-white"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        EN
      </button>
    </div>
  );
}
