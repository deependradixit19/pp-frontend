import { IMediaSearchResult } from './IMediaSearchResult'
import { ISearchResult } from './ISearchResult'

export interface ISearchField {
  customClass?: string
  value: string | undefined
  changeFn(val: string): void
  additionalProps?: { [key: string]: string | (() => void) }
  searchResults?: {
    resultsType: string
    resultsData: ISearchResult[]
  }
  mediaSearchResults?: IMediaSearchResult
  searchSettings?: {
    isForm?: boolean
    iconClickFn?: () => void
    formSubmitFn?: (e: any) => void
    hideIconOnMobile?: boolean
  }
  selectFn?: (value: string, id?: number) => void
  clearFn?: () => void
}
