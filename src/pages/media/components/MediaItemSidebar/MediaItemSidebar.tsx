import { FC } from 'react'
import { IconHeartFill, IconHeartOutline } from '../../../../assets/svg/sprite'
import { useLikePost } from '../../../../helpers/hooks'
import styles from './mediaItemSidebar.module.scss'

interface Props {
  likeCb: () => void
  liked: boolean
  count: number
}

const MediaItemSidebar: FC<Props> = ({ likeCb, liked, count }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.icon} onClick={likeCb}>
        {liked ? <IconHeartFill /> : <IconHeartOutline color='#fff' />}
      </div>

      <div className={styles.count}>{count}</div>
    </div>
  )
}

export default MediaItemSidebar
