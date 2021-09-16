import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { DEFAULT_LANGUAGE, enabledLanguages } from './enabledLanguages';

const languages = enabledLanguages.reduce((acc, lng) => {
  acc[lng] = {
    translation: require(`./translations/${lng}.json`),
  };
  return acc;
}, {});

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    // in case window.VEDACCIO_LANGUAGE is undefined,it will fall back to 'en-US'
    lng: window?.__VERDACCIO_BASENAME_UI_OPTIONS?.language || DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    whitelist: [...enabledLanguages],
    load: 'currentOnly',
    resources: languages,
    debug: false,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
