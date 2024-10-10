import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import BlackButton from '../../../../../components/Common/BlackButton/BlackButton'
import WhiteButton from '../../../../../components/Common/WhiteButton/WhiteButton'
import './_unsubscribe-modal.scss'

const UnsubscribeProfileModal: FC<{
  avatar: string | null
  displayName: string
  username: string
  subscribeFn: any
  setOpen: any
  isLoading?: boolean
}> = ({ avatar, displayName, username, subscribeFn, setOpen, isLoading }) => {
  const [showReason, setShowReason] = useState(false)
  const [reason, setReason] = useState('')

  const { t } = useTranslation()

  return (
    <div className='unsubscribe-modal-wrapper'>
      <div className='unsubscribe-modal-title'>{t('subscription')}</div>

      <div className='unsubscribe-modal-user-info-container'>
        <div className='unsubscribe-modal-profile-pic-container'>
          <img src={`${avatar}`} alt={t('profileAvatar')} />
        </div>
        <div className='unsubscribe-modal-user-info'>
          <div className='unsubscribe-modal-user-info-name'>{displayName}</div>
          <div className='unsubscribe-modal-user-info-username'>@{username}</div>
        </div>
      </div>
      <div className='unsubscribe-modal-description'>{t('ifYouUnsubscribe')} Sep 16, 2021</div>
      <div className='unsubscribe-modal-reason-text' onClick={() => setShowReason(!showReason)}>
        {t('addReason')}
      </div>
      <div
        className={`unsubscribe-modal-reason-input-wrapper ${
          showReason ? 'unsubscribe-modal-reason-input-wrapper-open' : ''
        }`}
      >
        <textarea
          className='unsubscribe-modal-reason-input'
          rows={5}
          value={reason}
          onChange={e => setReason(e.target.value)}
        />
      </div>
      <div className='unsubscribe-modal-buttons'>
        <WhiteButton text={t('back')} clickFn={() => setOpen(false)} />
        <BlackButton
          customClass={`unsubscribe-modal-unsub-button ${isLoading ? 'unsubscribe-modal-unsub-button-loading' : ''}`}
          text={t('unsubscribe')}
          clickFn={subscribeFn}
        />
      </div>
    </div>
  )
}

export default UnsubscribeProfileModal
