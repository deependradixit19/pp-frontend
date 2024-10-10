import { FC } from 'react'
import './_suggestedList.scss'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import Creator from '../CreatorsList/Creator/Creator'
import { getCreators } from '../../services/endpoints/creators'
import { ICreator } from '../../types/interfaces/ICreator'

const SuggestedList: FC = () => {
  const { t } = useTranslation()
  const { data: creatorsData, error } = useQuery(
    ['shortSuggestedCreators'],
    () =>
      getCreators({
        type: 'forYou',
        page: 1,
        search: null
      }),
    {
      refetchOnWindowFocus: false,
      select(data) {
        return data?.sortedCreators?.data?.slice(0, 3)?.map((creator: any) => ({
          ...creator,
          userId: creator.id,
          coverUrl: creator.cover,
          avatarUrl: creator.avatar,
          handle: creator.username
        }))
      }
    }
  )

  return (
    <div className='suggestedList'>
      <div className='suggestedList__top'>
        <div className='suggestedList__top--title'>{t('suggested')}</div>
        <div className='suggestedList__top--link'>
          <Link to='/creators'>{t('seeMore')}</Link>
        </div>
      </div>
      {creatorsData?.map((creator: ICreator) => (
        <Creator key={creator.userId} creatorData={creator} renderLocation={'suggested'} />
      ))}
    </div>
  )
}

export default SuggestedList
