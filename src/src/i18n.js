import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

import translationAR from "./locales/ar/translation.json";
import translationBG from "./locales/bg/translation.json";
import translationCN from "./locales/cn/translation.json";
import translationDE from "./locales/de/translation.json";
import translationEN from "./locales/en/translation.json";
import translationES from "./locales/es/translation.json";
import translationFR from "./locales/fr/translation.json";
import translationGR from "./locales/gr/translation.json";
import translationHU from "./locales/hu/translation.json";
import translationIT from "./locales/it/translation.json";
import translationJP from "./locales/jp/translation.json";
import translationKR from "./locales/kr/translation.json";
import translationNL from "./locales/nl/translation.json";
import translationPL from "./locales/pl/translation.json";
import translationPT from "./locales/pt/translation.json";
import translationRU from "./locales/ru/translation.json";
import translationSR from "./locales/sr/translation.json";
import translationSV from "./locales/sv/translation.json";
import translationTR from "./locales/tr/translation.json";
import translationTW from "./locales/tw/translation.json";

const resources = {
  ar: {
    translation: translationAR,
  },
  bg: {
    translation: translationBG,
  },
  cn: {
    translation: translationCN,
  },
  de: {
    translation: translationDE,
  },
  en: {
    translation: translationEN,
  },
  es: {
    translation: translationES,
  },
  fr: {
    translation: translationFR,
  },
  gr: {
    translation: translationGR,
  },
  hu: {
    translation: translationHU,
  },
  it: {
    translation: translationIT,
  },
  jp: {
    translation: translationJP,
  },
  kr: {
    translation: translationKR,
  },
  nl: {
    translation: translationNL,
  },
  pl: {
    translation: translationPL,
  },
  pt: {
    translation: translationPT,
  },
  ru: {
    translation: translationRU,
  },
  sr: {
    translation: translationSR,
  },
  sv: {
    translation: translationSV,
  },
  tr: {
    translation: translationTR,
  },
  tw: {
    translation: translationTW,
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
