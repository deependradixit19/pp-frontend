import { FC } from 'react'
import SearchField from '../../../components/Form/SearchField/SearchField'

const SearchWithTitle: FC<{
  title?: string
  searchValue?: string
  searchFn?: any
  clearFn?: any
  additionalProps?: any
  searchSettings?: {
    isForm?: boolean
    iconClickFn?: () => void
    formSubmitFn?: (e: any) => void
    hideIconOnMobile?: boolean
  }
}> = ({ title, searchValue, searchFn, additionalProps, searchSettings, clearFn }) => {
  return (
    <>
      <h1>{title}</h1>
      <SearchField
        value={searchValue}
        changeFn={searchFn}
        additionalProps={additionalProps}
        searchSettings={searchSettings}
        clearFn={clearFn}
      />
    </>
  )
}

export default SearchWithTitle
