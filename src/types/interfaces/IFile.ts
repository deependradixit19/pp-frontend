import { ITextObject } from './ITextObject'

export interface IFile {
  caption: string | null
  created_at: string
  id: number
  order: number
  thumbnail_src?: string | null
  url: string
  orientation: string | null
  type: string
  text?: ITextObject
  active_thumb?: string
}
