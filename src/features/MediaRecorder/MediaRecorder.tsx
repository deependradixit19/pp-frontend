import { FC, useRef, useCallback, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useStopwatch } from 'react-timer-hook'
import Webcam from 'react-webcam'

import { IconAudioOutline, IconLiveCamera, IconModalClose } from '../../assets/svg/sprite'
import './_mediaRecorder.scss'

interface Props {
  type: string
  status: string
  handleClose: () => void
  setRecordedChunks: (data: any) => void
  handleAudioStart: () => void
  handleAudioStop: () => void
}

const formatDuration = (duration: { seconds: number; minutes: number; hours: number }) => {
  const { seconds, minutes, hours } = duration
  return {
    seconds: seconds < 10 ? '0' + seconds : seconds.toString(),
    minutes: minutes < 10 ? '0' + minutes : minutes.toString(),
    hours: hours < 10 ? '0' + hours : hours.toString()
  }
}

const PostMediaRecorder: FC<Props> = ({
  type,
  status,
  handleClose,
  setRecordedChunks,
  handleAudioStart,
  handleAudioStop
}) => {
  const [mediaRecordingSupported, setMediaRecordingSupported] = useState(true)
  const [capturing, setCapturing] = useState(false)

  const streamRef = useRef<MediaStream | null>(null)
  const webcamRef = useRef<Webcam | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const { t } = useTranslation()

  const { seconds: sec, minutes: min, hours: h, isRunning, start, pause, reset } = useStopwatch({ autoStart: false })
  const { seconds, minutes } = formatDuration({
    seconds: sec,
    minutes: min,
    hours: h
  })

  useEffect(() => {
    checkMediaPlayer(type)

    return () => {
      if (streamRef && streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop()
        })
      }
    }
  }, [])

  useEffect(() => {
    if (status === 'recording') {
      start()
    }
  }, [status])

  const checkMediaPlayer = async (type: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: type === 'video',
        audio: true
      })
      streamRef.current = stream
    } catch (err) {
      setMediaRecordingSupported(false)
    }
  }

  const handleStartCaptureClick = useCallback(() => {
    if (webcamRef.current && webcamRef.current.stream) {
      setCapturing(true)
      start()
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: 'video/webm'
      })
      mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable)
      mediaRecorderRef.current.start()
    }
  }, [webcamRef, setCapturing, mediaRecorderRef])

  const handleDataAvailable = useCallback(
    ({ data }: { data: any }) => {
      if (data.size > 0) {
        setRecordedChunks((prev: any) => prev.concat(data))
      }
    },
    [setRecordedChunks]
  )

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current?.stop()
    setCapturing(false)
    reset()
    pause()
    handleClose()
  }, [mediaRecorderRef, webcamRef, setCapturing, handleClose])

  if (!mediaRecordingSupported) {
    return (
      <div className='mediaRecorder'>
        <div className='mediaRecorder__header'>
          <div></div>
          <h3 className='mediaRecorder__header__title'>
            {t('record')} {type}
          </h3>
          <div
            className='mediaRecorder__header__close'
            onClick={() => {
              handleClose()
            }}
          >
            <IconModalClose color='#fff' />
          </div>
        </div>
        <div className='mediaRecorder__card'>
          <div className='mediaRecorder__error'>{t('mediaRecordingNotSupportedOnIos')}</div>
        </div>
      </div>
    )
  }

  if (type === 'audio') {
    return (
      <div className='mediaRecorder mediaRecorder__audio'>
        <div className='mediaRecorder__header'>
          <div></div>
          <h3 className='mediaRecorder__header__title'>
            {t('record')} {type}
          </h3>
          <div className='mediaRecorder__header__close' onClick={() => handleClose()}>
            <IconModalClose color='#fff' />
          </div>
        </div>

        <div className='mediaRecorder__controls'>
          <div className='mediaRecorder__controls__duration'>
            {minutes}:{seconds}
          </div>
          <div className='mediaRecorder__controls__actions'>
            <div
              className={`mediaRecorder__controls__actions__wrapper ${capturing ? 'recording' : ''}`}
              onClick={() => {
                if (status === 'idle' || status === 'stopped') {
                  handleAudioStart()
                  // start();
                }
                if (status === 'recording') {
                  reset()
                  pause()
                  handleAudioStop()
                  handleClose()
                }
              }}
            >
              {status === 'recording' ? (
                <div className='mediaRecorder__controls__actions--stop'></div>
              ) : (
                <div className='mediaRecorder__controls__actions--record'></div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  } else if (type === 'video') {
    return (
      <div className='mediaRecorder'>
        <div className='mediaRecorder__header'>
          <div></div>
          <h3 className='mediaRecorder__header__title'>
            {t('record')} {type}
          </h3>

          <div className='mediaRecorder__header__close' onClick={() => handleClose()}>
            <IconModalClose color='#fff' />
          </div>
        </div>
        <>
          <Webcam audio={true} ref={webcamRef} />
          <div className='mediaRecorder__controls'>
            <div className='mediaRecorder__controls__duration'>
              {minutes}:{seconds}
            </div>
            <div
              className={`mediaRecorder__controls__actions__wrapper ${capturing ? 'recording' : ''}`}
              onClick={() => {
                if (!capturing) {
                  handleStartCaptureClick()
                } else {
                  handleStopCaptureClick()
                }
              }}
            >
              {capturing ? (
                <div className='mediaRecorder__controls__actions--stop'></div>
              ) : (
                <div className='mediaRecorder__controls__actions--record'></div>
              )}
            </div>
          </div>
        </>
      </div>
    )
  } else return null
}

export default PostMediaRecorder
