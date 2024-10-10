import { FC, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import ChangeStateTabs from '../../../components/UI/ChangeStateTabs/ChangeStateTabs'
import UsersList from '../../../features/UsersList/UsersList'

import { getProfileGroups } from '../../../services/endpoints/social'

const Active: FC<{
  sort_by?: string
  sort_order?: string
}> = ({ sort_by, sort_order }) => {
  const [activeTab, setActiveTab] = useState<string>('active')

  const { t } = useTranslation()

  const { data, error } = useQuery('allGroups', getProfileGroups)
  if (error) console.log('error', error)

  useEffect(() => {
    console.log(sort_by)
    console.log(sort_order)
  }, [sort_by, sort_order])

  const renderList = () => {
    switch (activeTab) {
      case 'active':
        return data.data[0].users

      default:
        return []
    }
  }

  return (
    <>
      <div className='fans__active'>
        <ChangeStateTabs
          tabs={[
            {
              value: 'active',
              name: t('active')
            },
            {
              value: 'expired',
              name: t('expired')
            }
          ]}
          activeTab={activeTab}
          clickFn={(val: string) => setActiveTab(val)}
          width='fit'
        />
        <div className='fans__active__number'>
          <b>{data?.data[0].users.length}</b> Fan
          {data?.data[0].users.length > 1 ? 's' : ''}
        </div>
      </div>
      {data ? <UsersList activeTab={activeTab} users={renderList()} userCardType='fan-with-buttons' /> : ''}
    </>
  )
}

export default Active
