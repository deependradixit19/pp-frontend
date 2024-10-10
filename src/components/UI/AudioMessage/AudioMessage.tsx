import { FC, useState, useRef, useEffect, MouseEvent } from 'react'
import './_audioMessage.scss'
import getBlobDuration from 'get-blob-duration'
import { useTimer } from 'react-use-precision-timer'
import { useTranslation } from 'react-i18next'
import { Icons } from '../../../helpers/icons'
import { formatVideoTime } from '../../../lib/dayjs'

type WaveColors = 'white' | 'blue' | 'gray'
type WaveBackgroundColor = 'white' | 'blue' | 'transparent'

interface IAudioActionProps {
  audioReady: boolean
  playing: boolean
  onPause: (event: MouseEvent<HTMLElement>) => void
  onPlay: (event: MouseEvent<HTMLElement>) => void
}

const AudioAction: FC<IAudioActionProps> = ({ audioReady, playing, onPause, onPlay }) => {
  const { t } = useTranslation()
  if (!audioReady) {
    return (
      <div className='audiomessage__preview__loader'>
        <span className='processingFileLoader'></span>
      </div>
    )
  }

  return playing ? (
    <div className='audiomessage__preview__play' onClick={onPause}>
      <img src={Icons.stop} alt={t('stop')} />
    </div>
  ) : (
    <div className='audiomessage__preview__play' onClick={onPlay}>
      <img src={Icons.play} alt={t('play')} />
    </div>
  )
}

const AudioMessage: FC<{
  audioBlob: any
  audioReady: boolean
  customClass?: string
  hasDeleteBtn?: boolean
  deleteFn?: () => void
  waveColor?: WaveColors
  waveOverlayColor?: WaveColors
  waveOverlayOpacity?: number
  waveHeight?: number
  waveBackgroundColor?: WaveBackgroundColor
  timerTextColor?: string
  timerTextSize?: number
  timerTextWidth?: number
  timerPosition?: string
  showPassed?: boolean
  column?: boolean
  percentage?: any
  processing?: boolean
  uploadError?: string
}> = ({
  audioBlob,
  audioReady,
  customClass,
  hasDeleteBtn,
  deleteFn,
  waveColor = 'white',
  waveOverlayColor = 'blue',
  waveBackgroundColor = 'blue',
  waveOverlayOpacity = 1,
  waveHeight = 20,
  timerTextSize = 10,
  timerTextColor = 'gray',
  timerTextWidth = 40,
  timerPosition = 'side',
  showPassed,
  column,
  percentage,
  processing,
  uploadError
}) => {
  const [playing, setPlaying] = useState<boolean>(false)
  const [listened, setListened] = useState<any>(0)
  const [fullyListened, setFullyListened] = useState<boolean>(false)
  const [duration, setDuration] = useState<any>('')
  const [durationPreview, setDurationPreview] = useState<string>('')
  const [dragging, setDragging] = useState(false)
  const audioRef = useRef<any>(null)
  const audioTrackRef = useRef<any>(null)

  const { t } = useTranslation()

  const listenedTimer = useTimer(
    {
      delay: 100
    },
    () => setListened((prevState: number) => prevState + 0.1)
  )

  useEffect(() => {
    if (playing) {
      listenedTimer.start()
    } else {
      listenedTimer.pause()
    }
    if (fullyListened) {
      listenedTimer.stop()
    }
  }, [playing, fullyListened, listenedTimer])

  useEffect(() => {
    if (audioBlob) {
      getBlobDuration(audioBlob).then(resp => {
        setDuration(resp)
      })
    }
  }, [audioBlob])

  useEffect(() => {
    if (duration) {
      const formattedDuration = formatVideoTime(duration)
      const formattedDurationPosition = formatVideoTime(duration - listened)
      if (showPassed) {
        setDurationPreview(`${formattedDurationPosition}/${formattedDuration}`)
      } else {
        setDurationPreview(formattedDurationPosition)
      }
    }
  }, [duration, listened, showPassed])

  const calcAudioRewindProgress = (e: any) => {
    let durationTime = 0
    if (audioTrackRef.current) {
      const targetRect = audioTrackRef.current.getBoundingClientRect()
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      let x = clientX - targetRect.left

      if (x < 0) {
        x = 0
      }
      if (x >= targetRect.width) {
        x = targetRect.width
      }
      const widthPercentage = x / targetRect.width

      durationTime = parseFloat(duration) * widthPercentage
    }
    return durationTime
  }

  const handleMouseDown = (e: any) => {
    setDragging(true)
    setPlaying(false)
    setFullyListened(false)
    if (audioRef.current) {
      audioRef.current.pause()
      const durationTime = calcAudioRewindProgress(e)
      setListened(durationTime)
      audioRef.current.currentTime = durationTime
    }
  }

  const handleMouseMove = (e: any) => {
    if (dragging) {
      setPlaying(false)
      setFullyListened(false)
      if (audioRef.current) {
        audioRef.current.pause()
        const durationTime = calcAudioRewindProgress(e)
        setListened(durationTime)
        audioRef.current.currentTime = durationTime
      }
    }
  }

  const handleMouseUp = (e: any) => {
    setDragging(false)
    if (audioRef.current) {
      audioRef.current.play()
      setPlaying(true)
    }
  }

  return (
    <div
      className={`audiomessage ${customClass ? customClass : ''} ${column ? 'audiomessage-column' : ''}`}
      onClick={event => {
        event.stopPropagation()
      }}
    >
      <div className='audiomessage__preview'>
        {hasDeleteBtn ? (
          <div className='audiomessage__preview__delete' onClick={deleteFn}>
            <img src={Icons.close} alt={t('removeAudioFile')} />
          </div>
        ) : (
          ''
        )}

        {uploadError ? <div className='audiomessage__preview__error'>{t('error:errorUploadingFile')}</div> : null}

        {!uploadError && (
          <>
            <div className={`audiomessage__preview__bars audiomessage__preview__bars__${waveBackgroundColor}`}>
              <div className='audiomessage__preview__bars__lines'>
                <div
                  className='audiomessage-waveform'
                  ref={audioTrackRef}
                  style={{
                    backgroundImage: `url(${Icons[`audio_waveform_${waveColor}`]})`,
                    height: `${waveHeight}px`
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onTouchMove={handleMouseMove}
                  onTouchStart={handleMouseDown}
                  onTouchEnd={handleMouseUp}
                >
                  <div
                    className='audiomessage-waveform-overlay'
                    style={{
                      width: `${(parseFloat(listened) / parseFloat(duration)) * 100}%`,
                      opacity: waveOverlayOpacity
                    }}
                  >
                    <div
                      className='audiomessage-waveform'
                      style={{
                        backgroundImage: `url(${Icons[`audio_waveform_${waveOverlayColor}`]})`,
                        height: `${waveHeight}px`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div
                className='audiomessage__preview__bars__length'
                style={{
                  color: timerTextColor,
                  fontSize: `${timerTextSize}px`,
                  width: `${timerTextWidth}px`
                }}
              >
                {durationPreview}
              </div>
            </div>
            <AudioAction
              audioReady={audioReady}
              playing={playing}
              onPause={event => {
                event.stopPropagation()
                audioRef.current.pause()
                setPlaying(false)
              }}
              onPlay={event => {
                event.stopPropagation()
                if (fullyListened) {
                  setListened(0)
                  setFullyListened(false)
                }
                audioRef.current.play()
                setPlaying(true)
              }}
            />
          </>
        )}
      </div>

      <audio
        ref={audioRef}
        className='audiomessage__audio'
        src={audioBlob}
        onEnded={() => {
          setPlaying(false)
          setFullyListened(true)
        }}
      />

      {processing && (
        <div className='processingFile__progress--bar'>
          <progress max='100' value={percentage}></progress>
        </div>
      )}
    </div>
  )
}

export default AudioMessage
