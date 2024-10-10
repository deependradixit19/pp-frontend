import { useTranslation } from 'react-i18next'
import AvatarHolder from '../AvatarHolder/AvatarHolder'
import { User } from '../../../types/types'

import './UserInfo.scss'

type UserInfoProps = {
  user: Partial<User>
  avatar: string | null
  showStats?: boolean
}

const UserInfo = (props: UserInfoProps) => {
  const {
    user: { online, name, display_name, username, follower_count, friend_count },
    avatar,
    showStats
  } = props

  const { t } = useTranslation()

  return (
    <div className='userInfo'>
      <AvatarHolder img={avatar || ''} size='80' isOnline={online} />
      <div className='userInfo__info'>
        <p className='userInfo__name'>{display_name || name}</p>
        <p className='userInfo__username'>@{username}</p>
        {showStats && (
          <p className='userInfo__stats'>
            <span>{follower_count}</span> {t('Fans')} | <span>{friend_count}</span> {t('friends')}
          </p>
        )}
      </div>
    </div>
  )
}

export default UserInfo
