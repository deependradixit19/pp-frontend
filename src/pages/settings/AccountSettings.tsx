import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LayoutHeader from '../../features/LayoutHeader/LayoutHeader'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'
import RenderSettingsCards from './layout/RenderSettingsCards'

const AccountSettings: FC = () => {
  const [searchTerm, setSeachTerm] = useState('')
  const { t } = useTranslation()
  return (
    <WithHeaderSection
      headerSection={
        <LayoutHeader
          type='search-with-title'
          title={t('account')}
          searchValue={searchTerm}
          searchFn={(term: string) => setSeachTerm(term)}
          clearFn={() => setSeachTerm('')}
          additionalProps={{ placeholder: t('searchSettings') }}
        />
      }
    >
      <RenderSettingsCards type='account' searchTerm={searchTerm} hasBottomSettings={true} />
    </WithHeaderSection>
  )
}

export default AccountSettings
