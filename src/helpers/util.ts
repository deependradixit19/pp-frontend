import { textChangeRangeIsUnchanged } from 'typescript'
import queryString from 'query-string'
import { IProfile } from '../types/interfaces/IProfile'
import { IPost } from '../types/interfaces/ITypes'
import { QueryParams } from '../types/types'

export const getImageOrientation = (url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => {
      let orientation = null
      if (img.naturalWidth > img.naturalHeight) {
        orientation = 'landscape'
      } else if (img.naturalWidth < img.naturalHeight) {
        orientation = 'portrait'
      } else {
        orientation = 'even'
      }
      resolve(orientation)
    })
    img.addEventListener('error', err => reject(err))
    img.src = url
  })

export function on<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args: Parameters<T['addEventListener']> | [string, Function | null, ...any]
): void {
  if (obj && obj.addEventListener) {
    obj.addEventListener(...(args as Parameters<HTMLElement['addEventListener']>))
  }
}

export function off<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args: Parameters<T['removeEventListener']> | [string, Function | null, ...any]
): void {
  if (obj && obj.removeEventListener) {
    obj.removeEventListener(...(args as Parameters<HTMLElement['removeEventListener']>))
  }
}

export function isDefined(value: any): boolean {
  return typeof value !== 'undefined'
}

export const randomString = (type: string) => {
  console.log({ type })
  const ext = type.split('/')[1]
  const length = 12
  const name = Math.round(Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))
    .toString(36)
    .slice(1)
  return name + '.' + ext
}

export const validateMedia = (mediaType: string, mediaFile: File) => {
  return new Promise((resolve, reject) => {
    if (mediaType === 'image') {
      const url = URL.createObjectURL(mediaFile)
      const img = new Image()
      img.src = url
      img.onload = () => {
        if (img.width > 6000 || img.height > 6000) {
          reject({ type: 'size', message: 'Image size is wrong!' })
        }

        resolve(true)
      }
    } else if (mediaType === 'video' || mediaType === 'audio') {
      const videoUploadLimit = 3221225472
      if (mediaFile.size > videoUploadLimit) {
        reject(Error('Media size is wrong!'))
      }
      resolve(true)
    }
  })
}

export function setQueryParameters(url: string, params?: QueryParams): string {
  if (!params) return url
  const paramsArr = Object.entries(params)
  const queryString = paramsArr.reduce((acc, [param, value], currentIndex, array) => {
    let paramValueStr = `${param}=${value}`
    if (currentIndex !== array.length - 1) paramValueStr += '&'
    return acc + paramValueStr
  }, '?')
  return url + queryString
}

export const getRole = (userData: IProfile, post: IPost) => {
  if (userData.role === 'model' && post.user_id === userData.id) return 'owner'
  return userData.role
}
export const validateText = (text: string) => {
  return text.trim().length !== 0 && text.trim().length < 150
}

export const toFixedNumber = (number: any, decimals = 2) => {
  return Number(number).toFixed(decimals)
}

export const queryFromSearchParams = (values: queryString.ParsedQuery<string>, initialQuery?: string) => {
  if (initialQuery) {
    let query = initialQuery
    console.log('before', query)
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'type') return
      if (!value || typeof value !== 'string') return

      query += '&' + key + '=' + value
    })
    console.log({ query })
    return query
  } else {
    let query = '?'
    Object.entries(values).forEach(([key, value], idx) => {
      if (!value || typeof value !== 'string') return
      if (idx === 0) {
        query += key + '=' + value
      } else {
        query += '&' + key + '=' + value
      }
    })
    console.log({ query })
    return query
  }
}

export function appendedArgsFn<TFn extends Function = (...args: any) => any, TAppendArgs extends unknown[] = any[]>(
  fn: TFn,
  ...appendArgs: TAppendArgs
) {
  return (...prependArgs: any) => fn(...prependArgs, ...appendArgs)
}
