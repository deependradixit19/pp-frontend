import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

import errorSA from '../../locales/sa/error.json'
import commonSA from '../../locales/sa/common.json'
import settingsSA from '../../locales/sa/settings.json'
import notificationsSA from '../../locales/sa/notifications.json'
import validationSA from '../../locales/sa/validation.json'

import errorEN from '../../locales/en/error.json'
import commonEN from '../../locales/en/common.json'
import settingsEN from '../../locales/en/settings.json'
import notificationsEN from '../../locales/en/notifications.json'
import validationEN from '../../locales/en/validation.json'

import errorDE from '../../locales/de/error.json'
import commonDE from '../../locales/de/common.json'
import settingsDE from '../../locales/de/settings.json'
import notificationsDE from '../../locales/de/notifications.json'
import validationDE from '../../locales/de/validation.json'

import errorES from '../../locales/es/error.json'
import commonES from '../../locales/es/common.json'
import settingsES from '../../locales/es/settings.json'
import notificationsES from '../../locales/es/notifications.json'
import validationES from '../../locales/es/validation.json'

import errorFR from '../../locales/fr/error.json'
import commonFR from '../../locales/fr/common.json'
import settingsFR from '../../locales/fr/settings.json'
import notificationsFR from '../../locales/fr/notifications.json'
import validationFR from '../../locales/fr/validation.json'

import errorIN from '../../locales/in/error.json'
import commonIN from '../../locales/in/common.json'
import settingsIN from '../../locales/in/settings.json'
import notificationsIN from '../../locales/in/notifications.json'
import validationIN from '../../locales/in/validation.json'

import errorIT from '../../locales/it/error.json'
import commonIT from '../../locales/it/common.json'
import settingsIT from '../../locales/it/settings.json'
import notificationsIT from '../../locales/it/notifications.json'
import validationIT from '../../locales/it/validation.json'

import errorJP from '../../locales/jp/error.json'
import commonJP from '../../locales/jp/common.json'
import settingsJP from '../../locales/jp/settings.json'
import notificationsJP from '../../locales/jp/notifications.json'
import validationJP from '../../locales/jp/validation.json'

import errorKR from '../../locales/kr/error.json'
import commonKR from '../../locales/kr/common.json'
import settingsKR from '../../locales/kr/settings.json'
import notificationsKR from '../../locales/kr/notifications.json'
import validationKR from '../../locales/kr/validation.json'

import errorPT from '../../locales/pt/error.json'
import commonPT from '../../locales/pt/common.json'
import settingsPT from '../../locales/pt/settings.json'
import notificationsPT from '../../locales/pt/notifications.json'
import validationPT from '../../locales/pt/validation.json'

import errorRO from '../../locales/ro/error.json'
import commonRO from '../../locales/ro/common.json'
import settingsRO from '../../locales/ro/settings.json'
import notificationsRO from '../../locales/ro/notifications.json'
import validationRO from '../../locales/ro/validation.json'

import errorRU from '../../locales/ru/error.json'
import commonRU from '../../locales/ru/common.json'
import settingsRU from '../../locales/ru/settings.json'
import notificationsRU from '../../locales/ru/notifications.json'
import validationRU from '../../locales/ru/validation.json'

import errorUA from '../../locales/ua/error.json'
import commonUA from '../../locales/ua/common.json'
import settingsUA from '../../locales/ua/settings.json'
import notificationsUA from '../../locales/ua/notifications.json'
import validationUA from '../../locales/ua/validation.json'

import errorCHS from '../../locales/chs/error.json'
import commonCHS from '../../locales/chs/common.json'
import settingsCHS from '../../locales/chs/settings.json'
import notificationsCHS from '../../locales/chs/notifications.json'
import validationCHS from '../../locales/chs/validation.json'

import errorCHT from '../../locales/cht/error.json'
import commonCHT from '../../locales/cht/common.json'
import settingsCHT from '../../locales/cht/settings.json'
import notificationsCHT from '../../locales/cht/notifications.json'
import validationCHT from '../../locales/cht/validation.json'

const resources = {
  sa: {
    common: commonSA,
    error: errorSA,
    notifications: notificationsSA,
    settings: settingsSA,
    validation: validationSA
  },
  en: {
    common: commonEN,
    error: errorEN,
    notifications: notificationsEN,
    settings: settingsEN,
    validation: validationEN
  },
  de: {
    common: commonDE,
    error: errorDE,
    notifications: notificationsDE,
    settings: settingsDE,
    validation: validationDE
  },
  es: {
    common: commonES,
    error: errorES,
    notifications: notificationsES,
    settings: settingsES,
    validation: validationES
  },
  fr: {
    common: commonFR,
    error: errorFR,
    notifications: notificationsFR,
    settings: settingsFR,
    validation: validationFR
  },
  in: {
    common: commonIN,
    error: errorIN,
    notifications: notificationsIN,
    settings: settingsIN,
    validation: validationIN
  },
  it: {
    common: commonIT,
    error: errorIT,
    notifications: notificationsIT,
    settings: settingsIT,
    validation: validationIT
  },
  jp: {
    common: commonJP,
    error: errorJP,
    notifications: notificationsJP,
    settings: settingsJP,
    validation: validationJP
  },
  kr: {
    common: commonKR,
    error: errorKR,
    notifications: notificationsKR,
    settings: settingsKR,
    validation: validationKR
  },
  pt: {
    common: commonPT,
    error: errorPT,
    notifications: notificationsPT,
    settings: settingsPT,
    validation: validationPT
  },
  ro: {
    common: commonRO,
    error: errorRO,
    notifications: notificationsRO,
    settings: settingsRO,
    validation: validationRO
  },
  ru: {
    common: commonRU,
    error: errorRU,
    notifications: notificationsRU,
    settings: settingsRU,
    validation: validationRU
  },
  ua: {
    common: commonUA,
    error: errorUA,
    notifications: notificationsUA,
    settings: settingsUA,
    validation: validationUA
  },
  chs: {
    common: commonCHS,
    error: errorCHS,
    notifications: notificationsCHS,
    settings: settingsCHS,
    validation: validationCHS
  },
  cht: {
    common: commonCHT,
    error: errorCHT,
    notifications: notificationsCHT,
    settings: settingsCHT,
    validation: validationCHT
  }
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    resources,
    defaultNS: 'common',

    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  })

export default i18n
