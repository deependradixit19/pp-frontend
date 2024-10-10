import './_privacySettings.scss'
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import WithHeaderSection from '../../../../layouts/WithHeaderSection/WithHeaderSection'
import LayoutHeader from '../../../../features/LayoutHeader/LayoutHeader'
import VerificationCode from '../../../../features/VerificationCode/VerificationCode'
import { Icons } from '../../../../helpers/icons'
import SuccessfulChange from '../../features/SuccessfulChange'
import FixedBottomButton from '../../../../components/UI/FixedBottomButton/FixedBottomButton'

const AuthentificatorApp: FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [switchBtn, setSwitchBtn] = useState<{
    name: string
    value: boolean
  }>({ name: '', value: false })

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <>
            <div className='authenticatorApp'>
              <h3>{t('howToSetup')}</h3>
              <p>
                {t('downloadInstallMicrosoftOrGoogleAuthenticator')} <img src={Icons.googlePlay} alt='Google Play' />
              </p>
              <p>
                {t('inAuthenticatorAppOpen')}
                <img src={Icons.appStore} alt={t('appStore')} />
              </p>
            </div>
            <VerificationCode />
            <button onClick={() => submitPage()} className='verification-btn'>
              {t('submit')}
            </button>
          </>
        )

      case 2:
        return (
          <>
            <SuccessfulChange img={Icons.scan} text={t('twoFactorAuthenticationHasBeenVerified')} />
            <FixedBottomButton
              text={t('close')}
              customClass='accountsettings__card__fixedbottombtn'
              clickFn={() => navigate('/settings/account?privacy-and-security')}
            />
          </>
        )
    }
  }

  const submitPage = () => {
    if (currentPage === 1) {
      setCurrentPage(2)
    }
  }

  return (
    <WithHeaderSection
      headerSection={
        <LayoutHeader
          type='switch'
          section={t('twoStepAuthentication')}
          title={t('authenticatorApp')}
          switchActive={switchBtn.value}
          switchFn={() => setSwitchBtn({ ...switchBtn, value: !switchBtn.value })}
        />
      }
    >
      {renderCurrentPage()}
    </WithHeaderSection>
  )
}

export default AuthentificatorApp
