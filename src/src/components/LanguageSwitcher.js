import React, { useState } from "react";
import { MenuItem, FormControl, Select } from "@mui/material";
import i18n from "i18next";

const LanguageSwitcher = () => {
  const [language, setLanguage] = useState(i18n.language || "en");

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    i18n.changeLanguage(selectedLanguage);
  };

  return (
    <FormControl variant="outlined" size="small">
      <Select value={language} onChange={handleLanguageChange}>
        <MenuItem value="ar">العربية</MenuItem>
        <MenuItem value="bg">Български</MenuItem>
        <MenuItem value="cn">简体中文</MenuItem>
        <MenuItem value="de">Deutsch</MenuItem>
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="es">Español</MenuItem>
        <MenuItem value="fr">Français</MenuItem>
        <MenuItem value="gr">Ελληνικά</MenuItem>
        <MenuItem value="hu">Magyar</MenuItem>
        <MenuItem value="it">Italiano</MenuItem>
        <MenuItem value="jp">日本語</MenuItem>
        <MenuItem value="kr">한국어</MenuItem>
        <MenuItem value="nl">Nederlands</MenuItem>
        <MenuItem value="pl">Polski</MenuItem>
        <MenuItem value="pt">Português</MenuItem>
        <MenuItem value="ru">Русский</MenuItem>
        <MenuItem value="sr">Српски</MenuItem>
        <MenuItem value="sv">Svenska</MenuItem>
        <MenuItem value="tr">Türkçe</MenuItem>
        <MenuItem value="tw">繁體中文</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher;
