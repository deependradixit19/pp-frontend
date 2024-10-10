import { ILanguage } from '../../types/interfaces/ITypes'
import { CookieName, destroyCookie, getCookie, setCookie } from '../cookies/cookies'

// TOKEN
const tokenKey: CookieName = 'pp_token'

export const setAccessToken = (token: string | null, remember = false): void => {
  removeAccessToken()
  const value = JSON.stringify(token)
  if (remember) {
    localStorage.setItem(tokenKey, value)
  } else {
    setCookie(tokenKey, value)
  }
}

export const removeAccessToken = (): void => {
  localStorage.clear()
  destroyCookie(tokenKey)
}

export const getAccessToken = () => {
  const token = localStorage.getItem(tokenKey)

  return token ? JSON.parse(token) : getCookie(tokenKey)
}
