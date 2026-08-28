import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const FALLBACK_LANGUAGE = "en";

// Endonyms for the switcher. A locale needs an entry here and a catalogue
// under src/locales to be offered.
const LANGUAGE_NAMES = {
  ar: "العربية",
  bg: "Български",
  cn: "简体中文",
  de: "Deutsch",
  en: "English",
  es: "Español",
  fr: "Français",
  gr: "Ελληνικά",
  hu: "Magyar",
  it: "Italiano",
  jp: "日本語",
  kr: "한국어",
  nl: "Nederlands",
  pl: "Polski",
  pt: "Português",
  ru: "Русский",
  sl: "Slovenščina",
  sr: "Српски",
  sv: "Svenska",
  tr: "Türkçe",
  tw: "繁體中文",
};

// Every catalogue is bundled, so there is nothing to fetch at runtime and no
// list of imports to keep in step with the directory.
const catalogues = import.meta.glob("./locales/*/translation.json", {
  eager: true,
  import: "default",
});

const resources = Object.fromEntries(
  Object.entries(catalogues).map(([path, translation]) => [
    path.split("/")[2],
    { translation },
  ])
);

export const LANGUAGES = Object.keys(resources)
  .filter((code) => LANGUAGE_NAMES[code])
  .sort()
  .map((code) => ({ code, name: LANGUAGE_NAMES[code] }));

export const RTL_LANGUAGES = ["ar"];

export function getPrimaryLanguage(language) {
  return String(language ?? "").split("-")[0];
}

export function isRtl(language) {
  return RTL_LANGUAGES.includes(getPrimaryLanguage(language));
}

// Several catalogues are filed under a country code rather than the ISO 639
// language code a browser actually reports, so map those across explicitly.
// Traditional Chinese is not aliased: load "languageOnly" collapses zh-TW to
// zh before a fallback is consulted, so tw stays a deliberate choice.
const ALIASES = {
  el: ["gr"],
  ja: ["jp"],
  ko: ["kr"],
  zh: ["cn"],
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    supportedLngs: [...Object.keys(resources), ...Object.keys(ALIASES)],
    // Treat "de-AT" as "de" rather than looking for a de-AT catalogue.
    load: "languageOnly",
    nonExplicitSupportedLngs: true,
    fallbackLng: { ...ALIASES, default: [FALLBACK_LANGUAGE] },
    // Verbose in dev, quiet under the test runner.
    debug: import.meta.env.DEV && !import.meta.env.VITEST,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
