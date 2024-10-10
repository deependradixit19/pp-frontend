import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import WithHeaderSection from '../../../layouts/WithHeaderSection/WithHeaderSection'
import LayoutHeader from '../../../features/LayoutHeader/LayoutHeader'

import ProfileSettings from '../pages/checkboxCards/ProfileSettings'
import ChatSettings from '../pages/checkboxCards/ChatSettings'
import SocialMediaSettings from '../pages/checkboxCards/SocialMediaSettings/SocialMediaSettings'
import DefaultFallbackPage from '../pages/DefaultFallbackPage'

const JustCheckboxCards: FC<{ [key: string]: string }> = ({ main, page }) => {
  const { t } = useTranslation()
  const configTitle = () => {
    switch (page) {
      case 'profile-settings':
        return t('settings:profileSettings')

      case 'chat-settings':
        return t('settings:chatSettings')

      case 'connect-social-accounts':
        return t('settings:socialMedia')
    }
  }

  const renderPage = () => {
    switch (page) {
      case 'profile-settings':
        return <ProfileSettings />

      case 'chat-settings':
        return <ChatSettings />

      case 'connect-social-accounts':
        return <SocialMediaSettings />

      default:
        return <DefaultFallbackPage />
    }
  }

  return (
    <WithHeaderSection
      customClass={`whs-${page}`}
      headerSection={<LayoutHeader type='basic' section={main} title={configTitle()} />}
    >
      {renderPage()}
    </WithHeaderSection>
  )
}

export default JustCheckboxCards
