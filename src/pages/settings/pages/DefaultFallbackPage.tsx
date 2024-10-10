import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import WithHeaderSection from '../../../layouts/WithHeaderSection/WithHeaderSection'

const DefaultFallbackPage: FC = () => {
  const { t } = useTranslation()
  return (
    <WithHeaderSection
      headerSection={
        <>
          <h1 className='singlesetting__section__title'>{t('comingSoon')}</h1>
        </>
      }
    >
      <div className='settings settings__fields'>{t('workInProgress')}</div>
    </WithHeaderSection>
  )
}

export default DefaultFallbackPage
