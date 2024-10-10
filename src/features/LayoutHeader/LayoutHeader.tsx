import { FC } from 'react'
import './_layoutHeader.scss'

import { useTranslation } from 'react-i18next'
import Basic from './types/Basic'
import WithSwitch from './types/WithSwitch'
import WithDots from './types/WithDots'
import WithInfo from './types/WithInfo'
import SearchWithTitle from './types/SearchWithTitle'
import SearchWithButtons from './types/SearchWIthButtons'
import TitleWithButtons from './types/TitleWithButtons'
import { ISearchResult } from '../../types/interfaces/ISearchResult'
import TitleWithButtonsNoIcon from './types/TitleWithButtonsNoIcon'
import { ListFilter } from '../../types/types'
import { IMediaSearchResult } from '../../types/interfaces/IMediaSearchResult'

const LayoutHeader: FC<{
  type: string
  section?: string
  title?: string
  titleWithIcon?: JSX.Element
  switchActive?: boolean
  switchFn?: any
  info?: string
  dots?: Array<any>
  searchValue?: string
  searchFn?: any
  searchResults?: {
    resultsType: string
    resultsData: ISearchResult[]
  }
  mediaSearchResults?: IMediaSearchResult
  additionalProps?: any
  sortingProps?: {
    selectedSort: string
    selectedOrder: string
    selectProps?: { [key: string | number]: string | number }
  }
  buttons?: Array<ListFilter> | any
  applyFn?: any
  selectFn?: (value: string, id?: number) => void
  clearFn?: () => void
  searchSettings?: {
    isForm?: boolean
    iconClickFn?: () => void
    formSubmitFn?: (e: any) => void
    hideIconOnMobile?: boolean
  }
}> = ({
  type,
  section,
  title,
  titleWithIcon,
  switchActive,
  switchFn,
  info,
  dots,
  searchValue,
  searchFn,
  searchResults,
  mediaSearchResults,
  additionalProps,
  sortingProps,
  buttons,
  applyFn,
  selectFn,
  clearFn,
  searchSettings
}) => {
  const { t } = useTranslation()
  const translatedTitle = t(title || '')
  const translatedSection = t(section || '')
  if (type === 'basic') {
    return <Basic section={translatedSection} title={translatedTitle} />
  } else if (type === 'switch') {
    return (
      <WithSwitch section={translatedSection} title={translatedTitle} switchActive={switchActive} switchFn={switchFn} />
    )
  } else if (type === 'dots') {
    return <WithDots section={translatedSection} title={translatedTitle} dots={dots} />
  } else if (type === 'info') {
    return <WithInfo section={translatedSection} title={translatedTitle} info={info} />
  } else if (type === 'search-with-title') {
    return (
      <SearchWithTitle
        title={translatedTitle}
        searchValue={searchValue}
        searchFn={searchFn}
        clearFn={clearFn}
        additionalProps={additionalProps}
        searchSettings={searchSettings}
      />
    )
  } else if (type === 'search-with-buttons') {
    return (
      <SearchWithButtons
        searchValue={searchValue}
        searchFn={searchFn}
        additionalProps={additionalProps}
        sortingProps={sortingProps}
        buttons={buttons}
        applyFn={applyFn}
        selectFn={selectFn}
        clearFn={clearFn}
        searchResults={searchResults}
        mediaSearchResults={mediaSearchResults}
        searchSettings={searchSettings}
      />
    )
  } else if (type === 'title-with-buttons') {
    return <TitleWithButtons titleWithIcon={titleWithIcon} buttons={buttons} applyFn={applyFn} />
  } else if (type === 'title-with-buttons-no-icon') {
    return (
      <TitleWithButtonsNoIcon title={translatedTitle} buttons={buttons} applyFn={applyFn} sortingProps={sortingProps} />
    )
  } else {
    return null
  }
}

export default LayoutHeader
