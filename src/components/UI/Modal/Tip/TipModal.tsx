import React, { FC, useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'

import { sendTipToModel } from '../../../../services/endpoints/profile'
import { sendTipToPost } from '../../../../services/endpoints/posts'
import { addToast } from '../../../Common/Toast/Toast'
import { ITipPayload } from '../../../../types/interfaces/ITypes'

// Context
import { useUserContext } from '../../../../context/userContext'
import { useModalContext } from '../../../../context/modalContext'
// Components
import WhiteButton from '../../../Common/WhiteButton/WhiteButton'
import CircleAvatar from '../../CircleAvatar/CircleAvatar'
import { IconDollarBold } from '../../../../assets/svg/sprite'
import Button from '../../Buttons/Button'

// styling
import './_tipModal.scss'

const TipModal: FC<{
  tipType?: 'model' | 'post'
  avatar?: string
  type?: string
  id?: number
  onClose?: () => any
  modelData: {
    postId?: number
    modelId: number
    avatarSrc: string
  }
}> = ({ avatar, id = 1, tipType = 'model', modelData, onClose }) => {
  const [tipAmt, setTipAmt] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [hasError, setHasError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [personalMessageVissible, setPersonalMessageVissible] = useState(false)

  const modalData = useModalContext()
  const userData = useUserContext()

  const queryClient = useQueryClient()
  const { t } = useTranslation()

  useEffect(() => {
    validateTipping()
  }, [])

  const handleChange = (e: any) => {
    const result = e.target.value.replace(/[^0-9]+/g, '')
    validateTipping(result)
    setTipAmt(result)
  }

  const sendTipToModelMutation = useMutation((payload: ITipPayload) => sendTipToModel(payload), {
    onSuccess: () => {
      modalData.clearModal()
      onClose && onClose()
      addToast('success', t('successfullyTipped'))
    },
    onError: () => {
      modalData.clearModal()
      onClose && onClose()
      addToast('error', t('error:anErrorOccuredPleaseTryAgain'))
    },
    onSettled: () => {
      queryClient.invalidateQueries('loggedProfile')
    }
  })

  const sendTipToPostMutation = useMutation((payload: ITipPayload) => sendTipToPost(payload), {
    onSuccess: () => {
      modalData.clearModal()
      onClose && onClose()
      addToast('success', t('successfullyTipped'))
    },
    onError: () => {
      modalData.clearModal()
      onClose && onClose()
      addToast('error', t('error:anErrorOccuredPleaseTryAgain'))
    },
    onSettled: () => {
      queryClient.invalidateQueries('loggedProfile')
    }
  })

  const submitTip = () => {
    if (tipAmt.trim() !== '' && !hasError) {
      const payload: ITipPayload = {
        model_id: modelData.modelId,
        amount: tipAmt,
        payment_method: userData.default_payment_method === 'wallet' ? 'deposit' : userData.default_payment_method
      }

      if (userData.default_payment_method === 'card' && userData.default_card) {
        payload.card_id = userData.default_card
      }

      if (tipType === 'post') {
        payload.post_id = modelData.postId
      }

      if (tipType === 'model') {
        sendTipToModelMutation.mutate(payload)
      } else {
        sendTipToPostMutation.mutate(payload)
      }
    } else {
      addToast('error', t('pleaseInputTipAmount'))
    }
  }

  const validateTipping = (result?: string) => {
    const { min, max } = getMinMaxTip()

    if (userData.available_daily_limit <= min) {
      setErrorMessage(`${t('error:dailyLimitExceeded')}`)
      setHasError(true)
      return
    }
    if (userData.default_payment_method === 'wallet' && userData.wallet_deposit < min) {
      setErrorMessage(`${t('error:notEnoughMoneyInTheWallet')}`)
      setHasError(true)
      return
    }
    if (result && (parseInt(result) < min || parseInt(result) > max)) {
      setHasError(true)
      setErrorMessage(`${t('error:tippingError')} $${min} USD - $
      ${max} USD`)
      return
    }

    setHasError(false)
    setErrorMessage('')
  }

  const getMinMaxTip = () => {
    let minValue = 1
    let maxValue = userData.new_user_account ? 100 : 200

    maxValue = userData.available_daily_limit < maxValue ? userData.available_daily_limit : maxValue
    maxValue =
      userData.default_payment_method === 'wallet' && userData.wallet_deposit < maxValue
        ? userData.wallet_deposit
        : maxValue

    minValue = userData.wallet_deposit !== 0 ? 1 : 3

    return {
      min: minValue,
      max: maxValue
    }
  }

  return (
    <div className='tip-modal'>
      <div className='tip-modal-input-avatar-container'>
        <div className={`tip-modal-input-wrapper ${tipAmt !== '' ? 'tip-modal-input-active' : ''}`}>
          <CircleAvatar imgUrl={modelData.avatarSrc} />
          <input
            type='text'
            pattern='[0-9]*'
            className={`tip-modal-input ${hasError ? 'error' : ''}`}
            value={tipAmt}
            onChange={e => handleChange(e)}
          />
          <div className='input-modal-dollar'>
            <IconDollarBold />
          </div>
        </div>
      </div>
      <p className={`tip-modal-min-text ${hasError ? 'error' : ''}`}>
        {hasError ? (
          <>{errorMessage}</>
        ) : (
          <>
            {t('minimum')} <span>${getMinMaxTip().min} USD</span> {t('maximum')} <span>${getMinMaxTip().max} USD</span>
          </>
        )}
      </p>
      <div
        className='tip-modal-personal-message-button'
        onClick={() => setPersonalMessageVissible(!personalMessageVissible)}
      >
        {t('addPersonalMessage')}
      </div>
      <div
        className={`tip-modal-personal-message-text-wrapper ${
          personalMessageVissible ? 'tip-modal-personal-message-text-wrapper-open' : ''
        }`}
      >
        <textarea
          className='tip-modal-personal-message-text'
          rows={5}
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
      </div>
      <div className='tip-modal-buttons-conainer'>
        <WhiteButton text={t('cancel')} customClass='tip-modal-cancel-button' clickFn={() => modalData.clearModal()} />
        <Button
          color='blue'
          text={t('send')}
          customClass={`tip-modal-send-button ${
            sendTipToModelMutation.isLoading || sendTipToPostMutation.isLoading ? 'tip-modal-send-button-loading' : ''
          }`}
          clickFn={submitTip}
        />
      </div>
    </div>
  )
}

export default TipModal
