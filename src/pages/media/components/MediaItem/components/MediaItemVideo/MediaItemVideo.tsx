import { FC, useState } from 'react'
import ReactPlayer from 'react-player'
import { IconPostPauseOutline, IconPostPlayOutline } from '../../../../../../assets/svg/sprite'
import { formatVideoTime } from '../../../../../../lib/dayjs'

import styles from './mediaItemVideo.module.scss'

interface Props {
  url: string
}

const MediaItemVideo: FC<Props> = ({ url }) => {
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [duration, setDuration] = useState<number | null>(null)
  return (
    <div className={styles.wrapper}>
      <ReactPlayer
        width='100%'
        url={url}
        controls={false}
        playing={videoPlaying}
        onPlay={() => setVideoPlaying(true)}
        onEnded={() => setVideoPlaying(false)}
        onDuration={dur => {
          setDuration(dur)
        }}
        onProgress={progress => {
          progress.playedSeconds && setDuration(progress.playedSeconds)
        }}
      />
      {duration !== null && <div className={styles.duration}>{formatVideoTime(duration)}</div>}
      <div
        className={styles.controls}
        onClick={(e: any) => {
          e.stopPropagation()
          setVideoPlaying(!videoPlaying)
        }}
      >
        {videoPlaying ? <IconPostPauseOutline /> : <IconPostPlayOutline />}
      </div>
    </div>
  )
}

export default MediaItemVideo
