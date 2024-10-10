import './_privacySettings.scss'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import WithHeaderSection from '../../../../layouts/WithHeaderSection/WithHeaderSection'
import ActionCard from '../../../../features/ActionCard/ActionCard'

const TwoStepVerification: FC = () => {
  const [switchBtn, setSwitchBtn] = useState<{
    firstCard: boolean
    secondCard: boolean
  }>({
    firstCard: false,
    secondCard: false
  })

  const { t } = useTranslation()

  const twoStepVerificationCards = [
    {
      id: 1,
      link: '/settings/account/privacy-and-security/two-step-verification/authentificator-app',
      hasArrow: true,
      hasToggle: true,
      toggleActive: switchBtn.firstCard,
      text: t('authenticatorApp'),
      toggleFn: () => {
        setSwitchBtn({ ...switchBtn, firstCard: !switchBtn.firstCard })
      },
      customClass: 'twoStepVerification__card'
    },
    {
      id: 2,
      link: '/settomgs/account/privacy-and-security/two-step-verification/sms-verification',
      hasArrow: true,
      hasToggle: true,
      toggleActive: switchBtn.secondCard,
      text: t('smsVerification'),
      toggleFn: () => {
        setSwitchBtn({ ...switchBtn, secondCard: !switchBtn.secondCard })
      },
      customClass: 'twoStepVerification__card'
    }
  ]

  return (
    <WithHeaderSection
      headerSection={
        <>
          <h2 className='singlesetting__section'>{t('privacySecurity')}</h2>
          <h1 className='singlesetting__section__title'>{t('twoStepAuthentication')}</h1>
        </>
      }
    >
      <div>
        {twoStepVerificationCards.map(item => {
          return (
            <ActionCard
              key={item.id}
              link={item.link}
              text={item.text}
              hasArrow={item.hasArrow}
              hasToggle={item.hasToggle}
              toggleActive={item.toggleActive}
              toggleFn={item.toggleFn}
              customClass={item.customClass}
            />
          )
        })}
      </div>
    </WithHeaderSection>
  )
}

export default TwoStepVerification
