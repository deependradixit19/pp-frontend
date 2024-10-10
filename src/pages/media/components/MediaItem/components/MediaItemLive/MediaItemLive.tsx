import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconUpcomingLive } from '../../../../../../assets/svg/sprite'
import { formatedDate } from '../../../../../../lib/dayjs'
import { ILiveFile } from '../../../../../../types/interfaces/ILiveFile'

import styles from './mediaItemLive.module.scss'

interface Props {
  live: ILiveFile
}

const MediaItemLive: FC<Props> = ({ live }) => {
  const { img_url: url, schedule_date } = live

  const { t } = useTranslation()
  return (
    <div className={styles.wrapper}>
      <img src={url} alt='media' />
      {schedule_date && (
        <div className='post__files__file__upcoming'>
          <IconUpcomingLive />
          <p>{t('upcomingLiveStream')}</p>
          <div className='post__files__file__upcoming__date'>{formatedDate(schedule_date, 'MMM D, h:mm A')}</div>
        </div>
      )}
      {/* <ReactPlayer
        width="100%"
        url={url}
        controls={false}
        playing={videoPlaying}
        onPlay={() => setVideoPlaying(true)}
        onEnded={() => setVideoPlaying(false)}
        onDuration={(dur) => {
          setDuration(dur);
        }}
        onProgress={(progress) => {
          progress.playedSeconds && setDuration(progress.playedSeconds);
        }}
      />
      {duration !== null && (
        <div className={styles.duration}>{formatVideoTime(duration)}</div>
      )}
      <div
        className={styles.controls}
        onClick={(e: any) => {
          e.stopPropagation();
          setVideoPlaying(!videoPlaying);
        }}
      >
        {videoPlaying ? <IconPostPauseOutline /> : <IconPostPlayOutline />}
      </div> */}
    </div>
  )
}

export default MediaItemLive
