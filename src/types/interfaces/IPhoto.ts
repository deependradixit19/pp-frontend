import { ITextObject } from './ITextObject'

export interface IPhoto {
  id?: number
  path?: string
  url?: string
  orientation?: string | null
  text?: ITextObject
  [key: string]: any
}
