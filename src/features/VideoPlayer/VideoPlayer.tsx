import { FC, useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { useQueryClient } from 'react-query'
import { IconPauseFill, IconPlayFill } from '../../assets/svg/sprite'
import { useUserContext } from '../../context/userContext'
import { useAutoplay, useVideoPlayedTracking } from '../../helpers/hooks'
import VideoPlayerControls from './VideoPlayerControls/VideoPlayerControls'

import './_videoPlayer.scss'

interface Props {
  url: string
  showControls: boolean
  minimized: boolean
  setShowControls: (showControls: boolean) => void
  isActive: boolean
  onPlay?: () => void
  shouldTrackPlayed?: boolean
  videoId?: number
  videoUserId?: number
}

const VideoPlayer: FC<Props> = ({
  url,
  showControls,
  minimized,
  setShowControls,
  isActive,
  onPlay: onPlayStart,
  shouldTrackPlayed,
  videoId,
  videoUserId
}) => {
  const [playing, setPlaying] = useState<boolean>(false)
  const [volumeBarShowing, setVolumeBarShowing] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(50)
  const [currentSeek, setCurrentSeek] = useState<number>(0)
  const [progressData, setProgressData] = useState<{
    played: number
    playedSeconds: number
    loaded: number
    loadedSeconds: number
  }>({
    played: 0,
    playedSeconds: 0,
    loaded: 0,
    loadedSeconds: 0
  })
  const [muted, setMuted] = useState<boolean>(false)

  const videoRef = useRef<ReactPlayer | null>(null)
  const userData = useUserContext()
  const queryClient = useQueryClient()
  const { autoplay } = useAutoplay({ onMutate: () => onAutoplayMutate() })

  const onPlayStartRef = useRef(onPlayStart)

  const { updateMaxPlayedS } = useVideoPlayedTracking(shouldTrackPlayed, url, videoId, videoUserId)

  useEffect(() => {
    onPlayStartRef.current = onPlayStart
  }, [onPlayStart])
  useEffect(() => {
    if (playing) {
      onPlayStartRef.current?.()
    }
  }, [playing])

  useEffect(() => {
    if (userData.autoplay && isActive) {
      setPlaying(true)
    }
  }, [userData, isActive])

  useEffect(() => {
    if (playing && !isActive) {
      setPlaying(false)
    }
  }, [playing, isActive])

  const handleOnProgress = (data: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    updateMaxPlayedS(data.playedSeconds)
    setProgressData(data)
    setCurrentSeek(data.played * 100)
  }
  const handleOnSeekChange = (e: any) => {
    videoRef.current && videoRef.current.seekTo(e, 'fraction')
  }

  const onAutoplayMutate = () => {
    userData.setUser({ ...userData, autoplay: !userData.autoplay })
  }

  const handleAutoplay = (prevState = false) => {
    autoplay.mutate(
      { prevState },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('loggedProfile')
        }
      }
    )
  }

  return (
    <div className={`videoPlayer videoPlayer--${minimized ? 'minimized' : ''}`}>
      {!minimized && (
        <div
          className={`videoPlayer__icon videoPlayer__icon${playing ? '--playing' : '--notPlaying'}`}
          onClick={() => setPlaying(playing => !playing)}
        >
          {playing ? <IconPauseFill /> : <IconPlayFill />}
        </div>
      )}

      <ReactPlayer
        ref={videoRef}
        className='preview__file__video'
        width='100%'
        height='100%'
        url={url}
        controls={false}
        volume={volume / 100}
        playing={playing}
        muted={muted}
        onProgress={handleOnProgress}
        progressInterval={100}
        onEnded={() => setPlaying(false)}
      />

      {showControls && (
        <VideoPlayerControls
          playing={playing}
          setPlaying={setPlaying}
          volume={volume}
          setVolume={setVolume}
          volumeBarShowing={volumeBarShowing}
          setVolumeBarShowing={setVolumeBarShowing}
          muted={muted}
          setMuted={setMuted}
          progressData={progressData}
          currentSeek={currentSeek}
          handleOnSeekChange={handleOnSeekChange}
          setProgress={handleOnSeekChange}
          minimized={minimized}
          autoplay={!!userData.autoplay}
          autoplayFn={handleAutoplay}
          autoplayLoading={autoplay.isLoading}
        />
      )}
      <div
        className='click__overlay'
        onClick={() => {
          setShowControls(!showControls)
        }}
      ></div>
    </div>
  )
}

export default VideoPlayer
