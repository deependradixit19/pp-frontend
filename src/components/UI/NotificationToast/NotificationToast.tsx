import { FC, ReactNode, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useQueryClient } from 'react-query'
import { IconNotificationHeartFill } from '../../../assets/svg/sprite'
import avatarPlaceholder from '../../../assets/images/user_placeholder.png'
import { someTimeAgo } from '../../../lib/dayjs'

import './_notificationToast.scss'
import { apiNotificationAsRead } from '../../../services/endpoints/api_notifications'

interface Props {
  avatarSrc?: string
  isOnline?: boolean
  hasDollar?: boolean
  isSystem?: boolean
  profileUrl?: string
  name: string
  atName: string
  time: string
  notificationId: number
  children: ReactNode
}

const NotificationToast: FC<Props> = ({
  avatarSrc,
  isOnline,
  hasDollar,
  name,
  atName,
  time,
  children,
  isSystem,
  profileUrl,
  notificationId
}) => {
  const interacted = useRef<boolean>(false)

  const queryClient = useQueryClient()

  const onInteraction = useCallback(() => {
    if (!interacted.current && notificationId) {
      interacted.current = true
      apiNotificationAsRead(notificationId)
      queryClient.invalidateQueries('pendingStats')
    }
  }, [notificationId, queryClient])

  return (
    <div className='notificationToast' onMouseDown={onInteraction} onTouchStart={onInteraction}>
      {isSystem ? (
        <img src={avatarSrc ?? avatarPlaceholder} alt='' />
      ) : (
        <Link className='notificationToast__avatar' to={profileUrl ?? ''}>
          <img src={avatarSrc ?? avatarPlaceholder} alt='' />
          <div className='notificationToast__avatar__heart'>
            <IconNotificationHeartFill />
          </div>
        </Link>
      )}
      <div className='notificationToast__content'>
        <div className='notificationToast__content__top'>
          {isSystem ? (
            <div className='notificationToast__content__top--name'>{name}</div>
          ) : (
            <Link className='notificationToast__content__top--name' to={profileUrl ?? ''}>
              {name}
            </Link>
          )}
          <div className='notificationToast__content__top--time'>{someTimeAgo(time)}</div>
        </div>
        {!isSystem && (
          <Link className='notificationToast__content__handle' to={profileUrl ?? ''}>
            @{atName}
          </Link>
        )}
        <div className='notificationToast__content__bottom'>{children}</div>
      </div>
    </div>
  )
}

export default NotificationToast
