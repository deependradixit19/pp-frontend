import { FC, useRef, useState, useEffect } from 'react'
import './_searchField.scss'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ISearchField } from '../../../types/interfaces/ISearchField'
import { IconCloseSm, IconMagnifyingGlass } from '../../../assets/svg/sprite'
import SearchResult from './SearchResult/SearchResult'
import { useOutsideAlerter } from '../../../helpers/hooks'
import MediaSearchResult from './MediaSearchResult/MediaSearchResult'

const SearchField: FC<ISearchField> = ({
  customClass,
  value,
  changeFn,
  additionalProps,
  searchResults,
  mediaSearchResults,
  searchSettings,
  selectFn,
  clearFn
}) => {
  const [autocompleteOpen, setAutocompleteOpen] = useState(false)
  const { t } = useTranslation()
  const searchRef = useRef<HTMLDivElement>(null)
  useOutsideAlerter(searchRef, () => setAutocompleteOpen(false))

  useEffect(() => {
    if (mediaSearchResults && !autocompleteOpen) {
      setAutocompleteOpen(true)
    }
  }, [mediaSearchResults])

  return (
    <div
      ref={searchRef}
      className={`searchfield ${customClass ? customClass : ''} ${autocompleteOpen ? 'searchActive' : ''}
      ${searchSettings ? (searchSettings.hideIconOnMobile ? 'searchfield--noIcon' : '') : ''}
      `}
      onClick={() => {
        if (searchResults || mediaSearchResults) {
          setAutocompleteOpen(autocompleteOpen => !autocompleteOpen)
        }
      }}
    >
      <div
        className='searchfield__icon'
        onClick={() => {
          if (searchSettings?.iconClickFn) {
            searchSettings.iconClickFn()
            setAutocompleteOpen(false)
          }
        }}
      >
        <IconMagnifyingGlass />
      </div>

      {searchSettings?.isForm ? (
        <form onSubmit={e => (searchSettings?.formSubmitFn ? searchSettings?.formSubmitFn(e) : null)}>
          <input
            className='searchfield__input'
            type='text'
            value={value}
            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
              changeFn(e.currentTarget.value)
            }}
            {...additionalProps}
          />
        </form>
      ) : (
        <input
          className='searchfield__input'
          type='text'
          value={value}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            changeFn(e.currentTarget.value)
          }}
          {...additionalProps}
        />
      )}
      {value && (
        <div
          className='searchfield__icon__close'
          onClick={() => {
            clearFn && clearFn()
          }}
        >
          <IconCloseSm />
        </div>
      )}
      {mediaSearchResults && autocompleteOpen && (
        <div className='searchfield__body'>
          <div className='searchfield__results'>
            {mediaSearchResults.users.map(result => (
              <MediaSearchResult
                key={result.id}
                user={result}
                clickFn={() => selectFn && selectFn(result.name, result.id)}
              />
            ))}

            {/* {mediaSearchResults.media.map(
              (result: {
                src: string;
                name: string;
                thumbnail: string | null;
              }) => (
                <MediaSearchResult media={result} />
              )
            )} */}
          </div>
        </div>
      )}
      {searchResults && autocompleteOpen && (
        <div className='searchfield__body'>
          {searchResults.resultsType === 'recent' && (
            <div className='searchfield__body__recent'>
              <p>{t('recentSearches')}</p>
              <span>{t('clear')}</span>
            </div>
          )}

          <div className='searchfield__body__divider'></div>
          <div className='searchfield__results'>
            {searchResults.resultsData.map(result => (
              <Link to={`/profile/${result.profileId}/all`} key={result.profileId}>
                <SearchResult result={result} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchField
