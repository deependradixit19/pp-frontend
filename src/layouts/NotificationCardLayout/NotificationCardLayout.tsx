import { FC } from 'react'
import { Link } from 'react-router-dom'
import { someTimeAgo } from '../../lib/dayjs'
import avatarPlaceholder from '../../assets/images/user_placeholder.png'

import AvatarHolder from '../../components/UI/AvatarHolder/AvatarHolder'
import styles from './_NotificationCardLayout.module.scss'

type INotificationCardLayout = {
  avatarSrc?: string
  name: string
  atName: string
  profileUrl?: string
  hasDollar?: boolean
  isOnline?: boolean
  time?: string
  isSystem?: boolean
  children: React.ReactNode
}

const NotificationCardLayout: FC<INotificationCardLayout> = ({
  avatarSrc = avatarPlaceholder,
  name,
  atName,
  profileUrl,
  hasDollar = false,
  isOnline = false,
  time,
  children,
  isSystem = false
}) => {
  return (
    <div className={`${styles.notificationCard}`}>
      {isSystem ? (
        <AvatarHolder img={avatarSrc || avatarPlaceholder} size='60' isOnline={isOnline} hasDollar={hasDollar} />
      ) : (
        <Link to={profileUrl || '/'}>
          <AvatarHolder img={avatarSrc || avatarPlaceholder} size='60' isOnline={isOnline} hasDollar={hasDollar} />
        </Link>
      )}
      <div className={styles.body}>
        <div className={styles.nameContainer}>
          {isSystem ? (
            <h2 className={`${styles.name} ${styles.isSystem}`}>{name}</h2>
          ) : (
            <Link to={profileUrl || '/' }>
              <h2 className={`${styles.name}`}>{name}</h2>
            </Link>
          )}
          {!isSystem && atName && (
            <Link to={profileUrl || '/'} className={styles.atName}>
              @{atName}
            </Link>
          )}
        </div>
        <div className={styles.content}>{children}</div>
        {time && <p className={styles.time}>{someTimeAgo(time)}</p>}
      </div>
    </div>
  )
}

export default NotificationCardLayout
