import { FC } from 'react'
import { useParams } from 'react-router-dom'
import './_support.scss'
import { useTranslation } from 'react-i18next'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import Home from './pages/Home'
import SubmitTicket from './pages/SubmitTicket'
import ContactLiveChat from './pages/ContactLiveChat'
import CreateTicket from './pages/CreateTicket'
import DesktopAdditionalContent from '../../features/DesktopAdditionalContent/DesktopAdditionalContent'

const Support: FC = () => {
  const { t } = useTranslation()
  const { id } = useParams<any>()
  const renderPages = () => {
    switch (id) {
      case 'home':
        return <Home />
      case 'contact-live-chat':
        return <ContactLiveChat />
      case 'submit-ticket':
        return <SubmitTicket />
      default:
        return <CreateTicket />
    }
  }
  return (
    <BasicLayout title={t('support')}>
      {renderPages()}
      <DesktopAdditionalContent />
    </BasicLayout>
  )
}

export default Support
