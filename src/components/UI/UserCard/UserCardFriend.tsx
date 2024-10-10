import { FC } from 'react'
import { Link } from 'react-router-dom'

import { useTranslation } from 'react-i18next'
import { AllIcons } from '../../../helpers/allIcons'
import AvatarHolder from '../AvatarHolder/AvatarHolder'
import IconButton from '../Buttons/IconButton'
import Button from '../Buttons/Button'
import FriendRequestMessageModal from '../Modal/FriendRequest/FriendRequestMessage/FriendRequestMessageModal'

import { useModalContext } from '../../../context/modalContext'
import { User } from '../../../types/types'

import './_userCard.scss'

//TODO separate in two components
const UserCardFriend: FC<{
  user: User
  type: string
  friendReqAccept?: () => void
  friendReqDeny?: () => void
  lastItemRef?: any
}> = ({ user, type, friendReqAccept, friendReqDeny, lastItemRef }) => {
  const modalData = useModalContext()
  const { t } = useTranslation()

  const showMessage = (user: User, friendReqAccept?: () => void, friendReqDeny?: () => void) => {
    modalData.addModal(
      t('friendRequest'),
      <FriendRequestMessageModal user={user} friendReqAccept={friendReqAccept} friendReqDeny={friendReqDeny} />
    )
  }

  if (type === 'request') {
    return (
      <div className='userCard userCard--friend userCard--friendReq' ref={lastItemRef}>
        <AvatarHolder size='80' img={user.croppedAvatar.url || user.avatar.url} isOnline={true} userId={user.id} />
        <div className='userCard__info'>
          <p className='userCard__info__name'>{user.name}</p>
          <p className='userCard__info__username'>@{user.username}</p>
          {user.fans ? (
            <p className='userCard__info__fans'>
              <span>{user.fans}</span> {t('Fans')}
            </p>
          ) : (
            ''
          )}
          {user.requested_at ? <p className='userCard__info__time'>{user.requested_at}</p> : ''}
          {user.message && (
            <p className='userCard__info__message' onClick={() => showMessage(user, friendReqAccept, friendReqDeny)}>
              {t('viewMessage')}
            </p>
          )}
        </div>
        <div className='userCard__actions'>
          <IconButton
            type='white'
            clickFn={friendReqDeny}
            icon={AllIcons.close}
            customClass='userCard__actions__deny'
          />
          <Button
            text={t('accept')}
            color='blue'
            font='mont-14-normal'
            width='fit'
            height='4'
            padding='1'
            clickFn={friendReqAccept}
          />
        </div>
      </div>
    )
  } else {
    return (
      <div className='userCard userCard--friend' ref={lastItemRef}>
        <div className='userCard__avatar'>
          <AvatarHolder img={user.avatar.url} size='80' userId={user.id} />
        </div>
        <div className='userCard__info'>
          <p className='userCard__info__name'>{user.name}</p>
          <p className='userCard__info__username'>{user.username}</p>
          <p className='userCard__info__fans'>
            <span>{user.fans}</span> {t('Fans')}
          </p>
        </div>
        <div className='userCard__actions'>
          <Link to={{ pathname: `/chat/${user.id}` }} state={{ activePage: !user.conversation ? 'newmessage' : '' }}>
            <IconButton type='white' icon={AllIcons.chat_bubble_blue} />
          </Link>
        </div>
      </div>
    )
  }
}

export default UserCardFriend
