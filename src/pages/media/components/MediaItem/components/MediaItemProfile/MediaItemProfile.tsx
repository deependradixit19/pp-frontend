import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { someTimeAgo } from '../../../../../../lib/dayjs'
import styles from './mediaItemProfile.module.scss'

interface Props {
  userId: number
  avatarUrl: string
  name: string
  createdAt: string | Date
}

const MediaItemProfile: FC<Props> = ({ userId, avatarUrl, name, createdAt }) => {
  const { t } = useTranslation()
  return (
    <div className={styles.profile}>
      <div className={styles.left}>
        <div className={styles.avatar}>
          <Link to={`/profile/${userId}/all`}>
            <img src={avatarUrl} alt={t('avatar')} />
          </Link>
        </div>
        <div className={styles.name}>
          <Link to={`/profile/${userId}/all`}>{name}</Link>
        </div>
      </div>
      <div className={styles.time}>{someTimeAgo(createdAt)}</div>
    </div>
  )
}

export default MediaItemProfile
