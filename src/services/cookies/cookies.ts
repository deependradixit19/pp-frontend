import { parseCookies, setCookie as setNCookie, destroyCookie as destroyNCookie } from 'nookies'

const isDev = typeof process !== 'undefined' ? process.env.MY_VAR : false
// const isDev = process?.env?.NODE_ENV === 'development';
const variableOptions = isDev
  ? {}
  : {
      secure: true,
      domain: window.location.hostname
    }

export type CookieName = 'pp_token' | 'pp_remember'

export const cookieOptions = {
  path: '/',
  ...variableOptions
}

export const setCookie = (name: CookieName, value: string, options: any = cookieOptions) => {
  setNCookie(null, name, value, options)
}

export const destroyCookie = (name: CookieName, options: any = cookieOptions) => {
  destroyNCookie(null, name, options)
}

export const getCookie = (name: CookieName) => {
  return JSON.parse(parseCookies()?.[name] ?? null)
}
