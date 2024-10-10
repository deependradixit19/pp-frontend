import { FC, useState } from 'react'
import './_privacySettings.scss'
import { useTranslation } from 'react-i18next'
import WithHeaderSection from '../../../../layouts/WithHeaderSection/WithHeaderSection'
import LayoutHeader from '../../../../features/LayoutHeader/LayoutHeader'
import UserCardBlocked from '../../../../components/UI/UserCard/UserCardBlocked'

const BlockedUsers: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const { t } = useTranslation()
  const user = {
    avatar: {
      url: 'https://www.planetware.com/wpimages/2020/02/france-in-pictures-beautiful-places-to-photograph-eiffel-tower.jpg'
    },
    name: 'Alex White',
    username: 'whitealexy'
  }
  return (
    <WithHeaderSection
      headerSection={
        <LayoutHeader
          type='search-with-buttons'
          searchValue={searchTerm}
          searchFn={(val: string) => setSearchTerm(val)}
          clearFn={() => setSearchTerm('')}
          additionalProps={{ placeholder: t('searchBlockedUsers') }}
          buttons={[
            {
              type: 'sort',
              elements: {
                first_section: [
                  {
                    value: 'most-recent',
                    name: t('recentlyBlocked')
                  },
                  {
                    value: 'name',
                    name: t('name')
                  }
                ],
                second_section: [
                  {
                    value: 'ascending',
                    name: t('ascending')
                  },
                  {
                    value: 'descending',
                    name: t('descending')
                  }
                ]
              }
            }
          ]}
        />
      }
    >
      <>
        <h3 className='blockedUsers__h3'>{t('blockedUsers')}</h3>
        <UserCardBlocked user={user} />
      </>
    </WithHeaderSection>
  )
}

export default BlockedUsers
