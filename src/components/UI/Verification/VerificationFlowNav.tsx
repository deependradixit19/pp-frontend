import { FC } from 'react'
import { StepWizardChildProps } from 'react-step-wizard'
import { IconCheckmark } from '../../../assets/svg/sprite'
import { useUserContext } from '../../../context/userContext'
import './_verification.scss'

const VerificationFlowNav: FC<Partial<StepWizardChildProps>> = ({ currentStep, goToStep }) => {
  const userData = useUserContext()
  return (
    <div className='steps'>
      <div
        className={`step ${currentStep === 1 ? 'active' : ''} ${currentStep && currentStep > 1 ? 'verified' : ''}`}
        // onClick={() => goToStep && goToStep(1)}
      >
        {currentStep && currentStep > 1 ? <IconCheckmark /> : '1'}
      </div>
      <span className='line'></span>
      <div
        className={`step ${currentStep === 2 ? 'active' : ''} ${currentStep && currentStep > 2 ? 'verified' : ''}`}
        // onClick={() => goToStep && goToStep(2)}
      >
        {currentStep && currentStep > 2 ? <IconCheckmark /> : '2'}
      </div>
      <span className='line'></span>
      <div
        className={`step ${currentStep === 3 ? 'active' : ''} ${currentStep && currentStep > 3 ? 'verified' : ''}`}
        // onClick={() => goToStep && goToStep(3)}
      >
        {currentStep && currentStep > 3 ? <IconCheckmark /> : '3'}
      </div>
      {/* <span className="line"></span> */}
      {/* <div
        className={`step ${currentStep === 4 ? 'active' : ''} ${
          currentStep && currentStep > 4 ? 'verified' : ''
        }`}
        // onClick={() => goToStep && goToStep(4)}
      >
        {currentStep &&
        currentStep === 4 &&
        userData.model_verification_status === 'pending' ? (
            <IconCheckmark />
          ) : (
            '4'
          )}
      </div> */}
    </div>
  )
}

export default VerificationFlowNav
