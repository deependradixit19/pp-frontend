import { FC } from 'react'
import './_searchResult.scss'
import { IconCloseSm } from '../../../../assets/svg/sprite'
import { ISearchResult } from '../../../../types/interfaces/ISearchResult'

interface Props {
  result: ISearchResult
  clickFn?: () => void
}

const SearchResult: FC<Props> = ({ result, clickFn }) => {
  return (
    <div
      className='searchResult'
      onClick={() => {
        clickFn && clickFn()
      }}
    >
      <div className='searchResult__content'>
        <div className='searchResult__avatar'>
          <img src={result.avatarUrl} alt='' />
        </div>
        <div className='searchResult__text'>
          <div className='searchResult__text--name'>{result.name}</div>
          <div className='searchResult__text--handle'>{result.handle}</div>
        </div>
      </div>
      <div className='searchResult__close'>
        <IconCloseSm />
      </div>
    </div>
  )
}

export default SearchResult
