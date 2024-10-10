import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { IPost, ISubscriptionHistoryItem } from '../../../../types/interfaces/ITypes'
import styles from './mediaItemSmall.module.scss'
import placeholderAvatar from '../../../../assets/images/user_placeholder.png'

interface Props {
  active: boolean
  data: ISubscriptionHistoryItem
  clickFn: () => void
}

const MediaItemSmall: FC<Props> = ({ active, data, clickFn }) => {
  const { t } = useTranslation()
  return (
    <div className={styles.wrapper}>
      <div className={styles.top} onClick={clickFn}>
        <div className={styles.cover} style={{ backgroundImage: `url(${data.coverSrc})` }}>
          {!!data.newPosts && (
            <div className={styles.count}>
              <span>{data.newPosts}</span> {t('new')}
            </div>
          )}

          <Link to={`/profile/${data.userId}/all`} className={`${styles.avatar} ${active ? styles.active : ''}`}>
            <img src={data.croppedAvatarSrc ?? data.avatarSrc ?? placeholderAvatar} alt={t('avatar')} />
          </Link>
        </div>
      </div>
      <div className={styles.bottom}>
        <Link to={`/profile/${data.userId}/all`} className={styles.title}>
          {data.userName}
        </Link>
        <div className={styles.subTitle}>New Posts</div>
      </div>
    </div>
  )
}

export default MediaItemSmall
