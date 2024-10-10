import { useTranslation } from 'react-i18next'
import UserInfo from '../../../UserInfo/UserInfo'
import Button from '../../../Buttons/Button'
import { AllIcons } from '../../../../../helpers/allIcons'
import IconButton from '../../../Buttons/IconButton'

import { User } from '../../../../../types/types'

import { useModalContext } from '../../../../../context/modalContext'

import './FriendRequestMessageModal.scss'

type FriendRequestMessageModalProps = {
  user: User
  friendReqAccept?: () => void
  friendReqDeny?: () => void
}

const FriendRequestMessageModal = (props: FriendRequestMessageModalProps) => {
  const modalContext = useModalContext()
  const { t } = useTranslation()

  const {
    user: { message },
    friendReqAccept,
    friendReqDeny
  } = props

  const handleAction = async (action?: () => void) => {
    action && action()
    modalContext.clearModal()
  }

  return (
    <div className='friendReqMessageModal'>
      <UserInfo user={props.user} avatar={props.user.avatar.url} />
      <div className='friendReqMessageModal__message'>{message}</div>
      <div className='buttons'>
        <IconButton
          type='white'
          clickFn={() => handleAction(friendReqDeny)}
          icon={AllIcons.close}
          customClass='button button__deny'
        />
        <Button
          text={t('accept')}
          color='blue'
          font='mont-14-normal'
          width='fit'
          padding='3'
          height='3'
          customClass='button button__accept'
          clickFn={() => handleAction(friendReqAccept)}
        />
      </div>
    </div>
  )
}

export default FriendRequestMessageModal
