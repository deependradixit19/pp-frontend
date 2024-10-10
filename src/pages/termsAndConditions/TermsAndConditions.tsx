import { FC } from 'react'
import './_termsAndConditions.scss'

import { useTranslation } from 'react-i18next'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'

const TermsAndConditions: FC = () => {
  const { t } = useTranslation()
  return (
    <BasicLayout title={t('termsPrivacyPolicyAndFees')} customClass='testandconds__layout' customHeaderLink='back'>
      <WithHeaderSection
        headerSection={
          <div className='testandconds__header'>
            <a href='#terms'>{t('termsOfUseForAllUsers')}</a>
            <a href='#terms'>{t('termsOfUseForFans')}</a>
            <a href='#terms'>{t('termsOfUseForCreators')}</a>
          </div>
        }
      >
        <div className='testandconds'>
          <div className='testandconds__body'>
            <h1>{t('termsOfUseTitleOfSection')}</h1>
            <h2>{t('termsOfUseTitleOfSubsection')}</h2>
            <ol className='testandconds__list testandconds__list--main'>
              <li>
                <b>{t('introduction')}:</b> {t('theseTermsOfUseForAllUsersGovernYourUsOfPerformerPlatform')}
              </li>
              <li>
                <b>{t('interpretation')}:</b> {t('inTheTermsOfService')}:
                <ol className='testandconds__list testandconds__list--alt'>
                  <li>
                    {t('weReferToOurWebsiteAs')} <b>"{t('performerPlatform')}"</b>,{' '}
                    {t('includingWhenAccessedViaTheUrlSoonOrViaAnyWebBrowser')};
                  </li>
                  <li>{t('referencesToWeOurUsAreReferencesToFenixInternationalLimited')};</li>
                </ol>
              </li>
            </ol>
          </div>
        </div>
      </WithHeaderSection>
    </BasicLayout>
  )
}

export default TermsAndConditions

//   <Header title="Terms, Privacy Policy and Fees" />
