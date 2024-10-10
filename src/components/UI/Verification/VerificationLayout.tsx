import { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from 'react-query'
import { useModalContext } from '../../../context/modalContext'
import { useUserContext } from '../../../context/userContext'
import { postConfirmVerify } from '../../../services/endpoints/profile'
import { IProfile } from '../../../types/interfaces/IProfile'
import FlashingArrow from '../../Common/FlashingArrow/FlashingArrow'
import Button from '../../UI/Buttons/Button'

interface Props {
  children: React.ReactNode
  currentStep?: number
  nextStep?: (data?: any) => void
  previousStep?: () => void
  nextDisabled: boolean
}

const VerificationLayout: FC<Props> = ({ children, currentStep, nextStep, previousStep, nextDisabled }) => {
  const modalData = useModalContext()
  const userData = useUserContext()
  const queryClient = useQueryClient()

  const { t } = useTranslation()

  useEffect(() => {
    if (currentStep === 4) {
      if (userData.model_verification_status !== 'pending') {
        modalData.addScroll()
      } else {
        modalData.removeScroll()
      }
    } else {
      modalData.removeScroll()
    }
  }, [currentStep, userData])

  const verifyUser = useMutation(
    (userId: number) => {
      return postConfirmVerify(userId)
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries('loggedProfile')
        modalData.clearModal()
      }
    }
  )

  return (
    <div
      className={`verificationLayout ${currentStep === 1 ? '' : 'padded'} ${
        currentStep === 4 && userData.model_verification_status === 'pending' ? 'withBg' : ''
      }`}
    >
      <div className='verificationLayout__header'>
        {t('step')} {currentStep && currentStep}
      </div>
      {children}
      {currentStep === 4 && userData.model_verification_status === 'pending' ? (
        <div className='verificationLayout__footer'>
          <Button
            text={t('approve')}
            color='blue'
            width='14'
            height='5'
            font='mont-14-semi-bold'
            clickFn={() => verifyUser.mutate(userData.id)}
          />
          <Button
            text={t('close')}
            color='blue'
            width='14'
            height='5'
            font='mont-14-semi-bold'
            clickFn={() => modalData.clearModal()}
          />
        </div>
      ) : (
        <div className='verificationLayout__footer'>
          <Button
            text={t('previous')}
            color='blue'
            width='14'
            height='5'
            font='mont-14-semi-bold'
            disabled={currentStep === 1}
            prevIcon={<FlashingArrow side='left' />}
            clickFn={() => previousStep && previousStep()}
          />
          <Button
            text={t('next')}
            color='blue'
            width='14'
            height='5'
            font='mont-14-semi-bold'
            disabled={nextDisabled}
            afterIcon={<FlashingArrow side='right' />}
            clickFn={() => nextStep && nextStep()}
          />
        </div>
      )}
    </div>
  )
}

export default VerificationLayout
