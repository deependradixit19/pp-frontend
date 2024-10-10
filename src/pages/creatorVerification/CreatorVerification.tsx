import { FC, useEffect } from 'react'
import { createPortal } from 'react-dom'
import StepWizard from 'react-step-wizard'
import { IconCloseLarge } from '../../assets/svg/sprite'
import VerificationCountry from '../../components/UI/Verification/VerificationCountry'
import VerificationFlowNav from '../../components/UI/Verification/VerificationFlowNav'
import VerificationIdentity from '../../components/UI/Verification/VerificationIdentity'
import VerificationPersonalInformation from '../../components/UI/Verification/VerificationPersonalInformation'
import VerificationUploadImages from '../../components/UI/Verification/VerificationUploadImages'

import './_creatorVerification.scss'

const CreatorVerification: FC<{ initialStep: number; closeFn: () => void }> = ({ initialStep, closeFn }) => {
  const portal = document.getElementById('portal')

  useEffect(() => {
    return () => {
      if (portal) {
        portal.classList.contains('portal--open') && portal.classList.remove('portal--open')
      }
    }
  }, [portal])

  if (!portal) return null
  !portal.classList.contains('portal--open') && portal.classList.add('portal--open')

  return createPortal(
    <div className={`creatorVerification overflowHidden`}>
      <div className='creatorVerification__close' onClick={() => closeFn()}>
        <IconCloseLarge />
      </div>
      <div className='creatorVerification__wizard'>
        <StepWizard
          nav={<VerificationFlowNav />}
          initialStep={initialStep}
          isHashEnabled={false}
          onStepChange={() => {
            window.scrollTo(0, 0)
          }}
        >
          <VerificationUploadImages hashKey={'upload-images'} />
          <VerificationCountry hashKey={'country-of-residence'} />
          {/* <VerificationIdentity hashKey={'verify-identity'} /> */}
          <VerificationPersonalInformation hashKey={'personal-information'} />
        </StepWizard>
      </div>
    </div>,
    portal
  )
}

export default CreatorVerification
