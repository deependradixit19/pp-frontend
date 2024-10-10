import { FC } from 'react'
import { IconHeartFill, IconHeartOutline, IconPostStats } from '../../../../../assets/svg/sprite'
import styles from './postStorySidebar.module.scss'

interface Props {
  showStats: boolean
  amount: number
  liked: boolean
  likeCount: number
  isEnabled: boolean
  toggleStats: () => void
  toggleLiked: () => void
}

const PostStorySidebar: FC<Props> = ({ isEnabled, showStats, amount, liked, likeCount, toggleStats, toggleLiked }) => {
  return (
    <div className={styles.postStorySidebar}>
      {showStats && (
        <div className={styles.action}>
          <div
            onClick={event => {
              event.stopPropagation()
              toggleStats()
            }}
          >
            <IconPostStats />
          </div>
          <p>${amount}</p>
        </div>
      )}

      <div className={styles.action}>
        <div
          onClick={event => {
            // if (!isEnabled) return;
            event.stopPropagation()
            toggleLiked()
          }}
        >
          {liked ? <IconHeartFill /> : <IconHeartOutline color={isEnabled ? '#fff' : '#afafaf'} />}
        </div>
        <p>{likeCount}</p>
      </div>

      {/* <div className="postSidebar__action">
        <div
          onClick={() => {
            if (!isEnabled) return;
            openComments();
          }}
        >
          <IconChatOutline color={isEnabled ? '#fff' : '#afafaf'} />
        </div>
        <p>{commentsCount}</p>
      </div> */}

      {/* {!hideTip && (
        <div className="postSidebar__action">
          <div
            onClick={() => {
              if (!isEnabled) return;
              addTip();
            }}
          >
            <IconLiveCircleTip color={isEnabled ? '#fff' : '#afafaf'} />
          </div>
        </div>
      )} */}
    </div>
  )
}

export default PostStorySidebar
