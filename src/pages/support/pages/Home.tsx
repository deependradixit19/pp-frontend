import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import WithHeaderSection from '../../../layouts/WithHeaderSection/WithHeaderSection'
import ActionCard from '../../../features/ActionCard/ActionCard'
import * as Icons from '../../../assets/svg/sprite'

const Home: FC = () => {
  const { t } = useTranslation()
  return (
    <WithHeaderSection
      withoutBorder={true}
      headerSection={
        <div className='support__header'>
          <Icons.supportIcon />
          <h2 className='support__header__title'>{t('howCanWeHelpYou')}?</h2>
        </div>
      }
    >
      <ActionCard
        text={t('howToFaq')}
        link='/how-to/tutorials'
        icon={<Icons.IconHowToBook />}
        absFix={true}
        hasArrow={true}
      />
      <ActionCard
        text={t('contactLiveChat')}
        link='/support/contact-live-chat'
        icon={<Icons.chatBubbles />}
        absFix={true}
        hasArrow={true}
      />
      <ActionCard
        text={t('submitATicket')}
        link='/support/submit-ticket'
        icon={<Icons.IconNote />}
        absFix={true}
        hasArrow={true}
        pendingNumber={7}
      />
      <div className='support__borderline'></div>
      <ActionCard icon={<Icons.IconLightMessage />} text='info@performer.com' suptext={t('sendUsAnEmail')} />
    </WithHeaderSection>
  )
}

export default Home
