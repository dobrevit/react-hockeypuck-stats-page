import { useState } from "react";
import { MenuItem, FormControl, Select, InputLabel } from "@mui/material";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { LANGUAGES, FALLBACK_LANGUAGE, getPrimaryLanguage } from "../i18n";

const LanguageSwitcher = () => {
  const { t } = useTranslation();
  // resolvedLanguage, not language: the detector reports the browser's full
  // tag ("de-DE"), while the catalogue actually in use is the base one ("de").
  // Seeding the control from the raw tag would leave it showing English while
  // the page is in German, and an unsupported tag would blank it entirely.
  const [language, setLanguage] = useState(() => {
    const resolved = i18n.resolvedLanguage ?? getPrimaryLanguage(i18n.language);
    return LANGUAGES.some(({ code }) => code === resolved) ? resolved : FALLBACK_LANGUAGE;
  });

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    i18n.changeLanguage(event.target.value);
  };

  const label = t("Language");

  return (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 140 }}>
      <InputLabel id="language-switcher-label">{label}</InputLabel>
      <Select
        labelId="language-switcher-label"
        id="language-switcher"
        value={language}
        // Required as well as the InputLabel: this is what cuts the gap in the
        // outline for the floating label to sit in.
        label={label}
        onChange={handleLanguageChange}
      >
        {LANGUAGES.map(({ code, name }) => (
          <MenuItem key={code} value={code}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher;
