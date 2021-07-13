import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationPL from './assets/locales/pl/translation.json';
import translationENGB from './assets/locales/en/translation.json';

const resources = {
  pl: {
    translation: translationPL
  },
  en: {
    translation: translationENGB
  }
};

i18n
.use(initReactI18next)
  .init({
    resources,
    lng: "en",

    keySeparator: false,

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;