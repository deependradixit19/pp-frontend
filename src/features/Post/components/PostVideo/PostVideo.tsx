import { FC, useState } from 'react'
import ReactPlayer from 'react-player'
import { IconPostPauseOutline, IconPostPlayOutline } from '../../../../assets/svg/sprite'
import { useVideoPlayedTracking } from '../../../../helpers/hooks'
import { formatVideoTime } from '../../../../lib/dayjs'

interface PostWithVideoProps {
  url: string
  videoId?: number
  videoUserId?: number
  shouldTrackPlayedS?: boolean
  updateSelectedPost: () => void
  thumbnail?: string
}

const PostVideo: FC<PostWithVideoProps> = ({
  url,
  shouldTrackPlayedS,
  videoId,
  videoUserId,
  updateSelectedPost,
  thumbnail
}) => {
  const [videoPlaying, setVideoPlaying] = useState<boolean>(false)
  const [duration, setDuration] = useState<number | null>(null)

  const { updateMaxPlayedS } = useVideoPlayedTracking(shouldTrackPlayedS, url, videoId, videoUserId)

  return (
    <div className='post__files__file' onClick={updateSelectedPost}>
      <ReactPlayer
        config={{ file: { attributes: { poster: thumbnail } } }}
        width='100%'
        height='100%'
        url={url}
        controls={false}
        playing={videoPlaying}
        onPlay={() => setVideoPlaying(true)}
        onEnded={() => setVideoPlaying(false)}
        playsinline={true}
        onDuration={dur => {
          setDuration(dur)
        }}
        onProgress={progress => {
          if (progress.playedSeconds) {
            setDuration(progress.playedSeconds)
            updateMaxPlayedS(progress.playedSeconds)
            // console.log('PLAYING', url);
          }
        }}
      />
      {duration !== null && <div className='post__files__file__duration'>{formatVideoTime(duration)}</div>}
      <div
        className='post__files__file__play'
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

export default PostVideo
