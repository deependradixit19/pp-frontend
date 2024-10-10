import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { IconPin } from '../../../../assets/svg/sprite'
import styles from './postInfoTop.module.scss'

interface Props {
  pinned: boolean
  live: boolean
  liveEnded: boolean
  customClass?: string
}

const PostInfoTop: FC<Props> = ({ pinned, live, liveEnded, customClass }) => {
  const { t } = useTranslation()
  return (
    <div className={`${styles.wrapper} ${customClass === 'preview' ? styles.preview : ''}`}>
      {live && (
        <div className={`${styles.info} ${styles.live}`}>
          <p>{t('live')}</p>
        </div>
      )}
      {!!pinned && (
        <div className={styles.info}>
          <IconPin />
          <p>{t('pinned')}</p>
        </div>
      )}
      {liveEnded && (
        <div className={styles.info}>
          <p>{t('liveStreamEnded')}</p>
        </div>
      )}
    </div>
  )
}

export default PostInfoTop
