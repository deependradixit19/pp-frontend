import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { handleFriendRequest } from '../../../../services/endpoints/friends'
import { addToast } from '../../../Common/Toast/Toast'
import FriendRequest from '../../NotificationToast/components/FriendRequest'

const FriendRequestNotification: FC<{
  data: any
}> = ({ data }) => {
  const { t } = useTranslation()

  if (data?.friendship_status == 0 || data?.isToast) {
    // pending
    return (
      <FriendRequest
        text={t('notifications:hasSentYouAFriendRequest')}
        onAcceptCb={async () => {
          try {
            await handleFriendRequest(data?.sender?.id, true)
            await addToast('success', t('friendRequestAccepted'))
          } catch (error) {
            addToast('error', t('error:acceptingFriendRequest'))
          }
        }}
        onDeclineCb={async () => {
          try {
            await handleFriendRequest(data?.sender?.id, false)
            addToast('success', t('friendRequestRejected'))
          } catch (error) {
            addToast('error', t('error:rejectingFriendRequest'))
          }
        }}
      />
    )
  } else if (data?.friendship_status == 1) {
    // accepted
    return (
      <div className='friendRequest'>
        <div className='friendRequest__text'>
          {t('notifications:hasSentYouAFriendRequest')}
          <br />
          {t('notifications:friendRequestWasAccepted')}
        </div>
      </div>
    )
  } else if (data?.friendship_status == 2 || data?.friendship_status == 3) {
    // denied or blocked
    return (
      <div className='friendRequest'>
        <div className='friendRequest__text'>
          {t('notifications:hasSentYouAFriendRequest')}
          <br />
          {t('notifications:friendRequestWasDenied')}
        </div>
      </div>
    )
  } else {
    return (
      <div className='friendRequest'>
        <div className='friendRequest__text'>{t('notifications:hasSentYouAFriendRequest')}</div>
      </div>
    )
  }
}

export default FriendRequestNotification
