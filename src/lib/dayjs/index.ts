import dayjs, { Dayjs } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import isoWeek from 'dayjs/plugin/isoWeek'

import 'dayjs/locale/zh-cn'
import 'dayjs/locale/zh-tw'
import 'dayjs/locale/de'
import 'dayjs/locale/es'
import 'dayjs/locale/fr'
import 'dayjs/locale/hi'
import 'dayjs/locale/it'
import 'dayjs/locale/ja'
import 'dayjs/locale/ko'
import 'dayjs/locale/pt'
import 'dayjs/locale/ro'
import 'dayjs/locale/ru'
import 'dayjs/locale/ar-sa'
import 'dayjs/locale/uk'

dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.extend(localizedFormat)
dayjs.extend(isoWeek)

export const formatedDate = (date: string | Date, format: string) => {
  return dayjs(date).format('MMM D, h:mm A')
}

export const getShortIsoDate = (date: string | Date | Dayjs) => {
  return dayjs(date).format('YYYY-MM-DD')
}

export const someTimeAgo = (time: any) => {
  // console.log({ time });
  return dayjs(dayjs(time).format('YYYY-MM-DD HH:mm:ss')).fromNow()
}

export const formatChatTime = (time: any) => {
  if (
    dayjs(dayjs(new Date(`20${time}`)).format('YYYY-MM-DD HH:mm:ss'))
      .fromNow()
      .includes('day')
  ) {
    return dayjs(dayjs(new Date(`20${time}`)).format('YYYY-MM-DD HH:mm:ss')).fromNow()
  } else {
    return dayjs(new Date(`20${time}`)).format('LT')
  }
}

export const localeDate = (date: string | Date) => {
  return dayjs(date).format('L')
}

export const wordedDayDate = (date: string | Date) => {
  return dayjs(date).format('dddd, MMMM D, YYYY')
}

export const localeShortWordDate = (date: string | Date) => {
  return dayjs(date).format('ll')
}

export function formatVideoTime(duration: number) {
  const hrs = Math.floor(duration / 3600)
  const mins = Math.floor((duration % 3600) / 60)
  const secs = Math.floor(duration % 60)

  let ret = ''

  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '')
  }

  ret += '' + mins + ':' + (secs < 10 ? '0' : '')
  ret += '' + secs

  if (duration <= 0) return '0:00'
  return ret
}
export const setDateTimeLocale = (loc: string) => {
  console.log({ loc })
  switch (loc) {
    case 'chs':
      dayjs.locale('zh-cn')
      break
    case 'cht':
      dayjs.locale('zh-tw')
      break
    case 'de':
      dayjs.locale('de')
      break
    case 'es':
      dayjs.locale('es')
      break
    case 'fr':
      dayjs.locale('fr')
      break
    case 'in':
      dayjs.locale('hi')
      break
    case 'it':
      dayjs.locale('it')
      break
    case 'jp':
      dayjs.locale('ja')
      break
    case 'kr':
      dayjs.locale('ko')
      break
    case 'pt':
      dayjs.locale('pt')
      break
    case 'ro':
      dayjs.locale('ro')
      break
    case 'ru':
      dayjs.locale('ru')
      break
    case 'sa':
      dayjs.locale('ar-sa')
      break
    case 'ua':
      dayjs.locale('uk')
      break
    default:
      dayjs.locale('en')
  }
  dayjs.locale(loc)
}
export const getDateTimeLocale = (loc: string) => {
  switch (loc) {
    case 'chs':
      return 'zh'
    case 'cht':
      return 'zh'
    case 'de':
      return 'de'
    case 'es':
      return 'es'
    case 'fr':
      return 'fr'
    case 'in':
      return 'hi'
    case 'it':
      return 'it'
    case 'jp':
      return 'ja'
    case 'kr':
      return 'ko'
    case 'pt':
      return 'pt'
    case 'ro':
      return 'ro'
    case 'ru':
      return 'ru'
    case 'sa':
      return 'ar'
    case 'ua':
      return 'uk'
    default:
      return 'en'
  }
}
