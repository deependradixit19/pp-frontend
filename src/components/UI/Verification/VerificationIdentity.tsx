import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { StepWizardChildProps } from 'react-step-wizard'
import VerificationLayout from './VerificationLayout'

const VerificationIdentity: FC<Partial<StepWizardChildProps>> = ({ currentStep, nextStep, previousStep, hashKey }) => {
  const { t } = useTranslation()
  return (
    <VerificationLayout currentStep={currentStep} nextStep={nextStep} previousStep={previousStep} nextDisabled={false}>
      <div className='verificationStep'>
        <h3 className='verificationStep__title'>{t('verifyYourIdentity')}</h3>
      </div>
    </VerificationLayout>
  )
}

export default VerificationIdentity
