import { FC, useEffect, useState } from 'react'
import { StepWizardChildProps } from 'react-step-wizard'
import { useTranslation } from 'react-i18next'
import VerificationLayout from './VerificationLayout'

import { useUserContext } from '../../../context/userContext'
import CreatorProfileHolder from '../../../pages/creatorVerification/components/CreatorProfileHolder/CreatorProfileHolder'

const VerificationUploadImages: FC<Partial<StepWizardChildProps>> = ({
  currentStep,
  nextStep,
  previousStep,
  hashKey
}) => {
  const [nextButtonDisabled, setNextButtonDisabled] = useState(true)

  const userData = useUserContext()
  const { t } = useTranslation()

  useEffect(() => {
    if (userData) {
      if (
        (userData.cover?.url || userData.cropped_cover?.url) &&
        (userData.cropped_avatar?.url || userData.avatar?.url)
      ) {
        nextButtonDisabled && setNextButtonDisabled(false)
      }
    }
  }, [userData, nextButtonDisabled])
  return (
    <VerificationLayout
      currentStep={currentStep}
      nextStep={nextStep}
      previousStep={previousStep}
      nextDisabled={nextButtonDisabled}
    >
      <div className='verificationStep'>
        <h3 className='verificationStep__title'>{t('uploadYourImages')}</h3>
        <CreatorProfileHolder
          id={userData?.id}
          cover={userData?.cover?.url || userData?.cropped_cover?.url}
          avatar={userData?.cropped_avatar?.url || userData.avatar?.url}
          display_name={userData?.display_name}
          follower_count={userData?.follower_count}
          friend_count={userData?.friend_count}
          username={userData?.username}
        />
      </div>
    </VerificationLayout>
  )
}

export default VerificationUploadImages
