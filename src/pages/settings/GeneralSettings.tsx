import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'
import LayoutHeader from '../../features/LayoutHeader/LayoutHeader'
import RenderSettingsCards from './layout/RenderSettingsCards'

const GeneralSettings: FC = () => {
  const [searchTerm, setSeachTerm] = useState<string>('')
  const { t } = useTranslation()

  return (
    <WithHeaderSection
      headerSection={
        <LayoutHeader
          type='search-with-title'
          title={t('general')}
          searchValue={searchTerm}
          searchFn={(term: string) => setSeachTerm(term)}
          clearFn={() => setSeachTerm('')}
          additionalProps={{ placeholder: t('searchSettings') }}
        />
      }
    >
      <RenderSettingsCards type='general' searchTerm={searchTerm} />
    </WithHeaderSection>
  )
}

export default GeneralSettings
