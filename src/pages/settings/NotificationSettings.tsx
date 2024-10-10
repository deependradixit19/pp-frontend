import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LayoutHeader from '../../features/LayoutHeader/LayoutHeader'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'
import RenderSettingsCards from './layout/RenderSettingsCards'
import styles from './NotificationSettings.module.scss'

const NotificationSettings: FC = () => {
  const [searchTerm, setSeachTerm] = useState('')
  const { t } = useTranslation()

  return (
    <WithHeaderSection
      customClass={styles.settings_notifications}
      headerSection={
        <LayoutHeader
          type='search-with-title'
          title={t('Notifications')}
          searchValue={searchTerm}
          searchFn={(term: string) => setSeachTerm(term)}
          clearFn={() => setSeachTerm('')}
          additionalProps={{ placeholder: t('searchSettings') }}
        />
      }
    >
      <RenderSettingsCards type='notifications' searchTerm={searchTerm} />
    </WithHeaderSection>
  )
}

export default NotificationSettings
