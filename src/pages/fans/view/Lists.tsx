import { FC } from 'react'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import { Icons } from '../../../helpers/icons'

import { getProfileGroups } from '../../../services/endpoints/social'

import FansList from '../../../features/FansList/FansList'

const Lists: FC<any> = () => {
  const { t } = useTranslation()
  const { data, error } = useQuery('allGroups', getProfileGroups, {
    refetchOnWindowFocus: false
  })

  return (
    <>
      {data?.data.map((fans: { name: string; avatars: Array<string>; count: number }, key: number) => (
        <FansList key={key} title={fans.name} fans={{ avatars: fans.avatars, count: fans.count }} />
      ))}
      <div className='fans__addlist'>
        <div className='fans__addlist__icon'>
          <img src={Icons.plusSquare} alt={t('addNewList')} />
        </div>
        <div className='fans__addlist__text'>
          <p>{t('addNewList')}</p>
        </div>
      </div>
    </>
  )
}

export default Lists
