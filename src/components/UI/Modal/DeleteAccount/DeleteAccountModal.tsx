import { FC, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import './_deleteAccountModal.scss'
import { useTranslation } from 'react-i18next'
import InputCard from '../../../Form/InputCard/InputCard'
import VerificationCode from '../../../../features/VerificationCode/VerificationCode'
import Button from '../../Buttons/Button'
import { addToast } from '../../../Common/Toast/Toast'
import { deleteUser } from '../../../../services/endpoints/profile'
import { useModalContext } from '../../../../context/modalContext'
import ConfirmModal from '../Confirm/ConfirmModal'
import { logoutUser } from '../../../../services/endpoints/auth'

const DeleteAccountModal: FC<{
  type: string
}> = ({ type }) => {
  const [typeActive, setTypeActive] = useState<string>('')
  const [reason, setReason] = useState<{
    active: boolean
    text: string
  }>({
    active: false,
    text: ''
  })

  const [code, setCode] = useState('')

  const navigate = useNavigate()

  const { t } = useTranslation()
  const modalData = useModalContext()

  useEffect(() => {
    setTypeActive(type)
  }, [type])

  const submitFunction = () => {
    if (code.trim() === '' || code.trim().length < 6) {
      addToast('error', t('pleaseInputVerificationCode'))
      return
    }

    addToast('loading', t('deletingAccount'))
    deleteUser({ delete_reason: reason.text, code }).then(resp => {
      toast.dismiss()
      if (resp.message?.original?.message === 'Wrong code!') {
        addToast('error', t('invalidCode'))
        return
      }

      modalData.clearModal()
      addToast('success', t('accountDeleted'))
      logoutUser(navigate)
    })
  }

  if (typeActive === 'delete') {
    return (
      <>
        <div className='deleteAccountModal__description'>{t('warningOnceYouDeleteYourAccount')}</div>
        <div
          className={`deleteAccountModal__reason deleteAccountModal__reason--${reason.active ? 'active' : 'inactive'}`}
        >
          <p onClick={() => setReason({ active: !reason.active, text: '' })}>{t('addReason')}</p>
          <InputCard
            isTextArea={true}
            type='text'
            label={`${t('reason')}...`}
            value={reason.text}
            changeFn={(val: string) => setReason({ ...reason, text: val })}
            customClass='deleteAccountModal__reason__input'
          />
        </div>
        <VerificationCode changeFn={setCode} />
        <div className='deleteAccountModal__description deleteAccountModal__description--bot'>
          {t('youCanDeactivateYourAccount')}
        </div>
        <div className='deleteAccountModal__buttons'>
          <Button
            text={t('deleteAccount')}
            color='transparent'
            type='transparent--black'
            font='mont-14-normal'
            height='3'
            width='100'
            clickFn={() => submitFunction()}
          />
          {/* <button className="deleteAccountModal__button deleteAccountModal__button--white">
            Delete Account
          </button>
          <button className="deleteAccountModal__button deleteAccountModal__button--grey">
            Deactivate
          </button> */}
        </div>
      </>
    )
  } else {
    return (
      <>
        <div className='deleteAccountModal__description'>{t('youCanDeactivateYourAccount')}</div>
        <div
          className={`deleteAccountModal__reason deleteAccountModal__reason--${reason.active ? 'active' : 'inactive'}`}
        >
          <p onClick={() => setReason({ active: !reason.active, text: '' })}>{t('addReason')}</p>
          <InputCard
            isTextArea={true}
            type='text'
            label={`${t('reason')}...`}
            value={reason.text}
            changeFn={(val: string) => setReason({ ...reason, text: val })}
            customClass='deleteAccountModal__reason__input'
          />
        </div>
        <VerificationCode />
        <div className='deleteAccountModal__buttons'>
          <Button text={t('deactivate')} color='black' font='mont-16-bold' width='20' height='5' disabled={true} />
        </div>
      </>
    )
  }
}

export default DeleteAccountModal
