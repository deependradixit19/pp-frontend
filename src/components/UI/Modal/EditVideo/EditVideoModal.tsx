import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react'
import './_editVideoModal.scss'
import ReactPlayer from 'react-player'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { FreeMode } from 'swiper/modules'
import 'swiper/css'
import ReactSlider from 'react-slider'
import { useTranslation } from 'react-i18next'
import Button from '../../Buttons/Button'
import { formatVideoTime } from '../../../../lib/dayjs'
import { useVideoPlayerOrientation } from '../../../../helpers/helperHooks'
import { IconPauseFill, IconPlayFill } from '../../../../assets/svg/sprite'
import { Swiper as SwiperClass } from 'swiper'

const EditVideoModal: FC<{
  vidSrc: any
  storageSrc: string
  thumbnails?: string[]
  start?: number
  end?: number
  cancelCb: () => void
  confirmCb: (data: { startTime: number; endTime: number; path: string }) => void
  orientation?: string
}> = ({ vidSrc, storageSrc, thumbnails, cancelCb, confirmCb, orientation, start, end }) => {
  const PREVIEW_LIMIT = 30 // max 30s

  // initial start and end not implemented.
  const [sliderValues, setSliderValues] = useState([0, 50, 100])
  const [playing, setPlaying] = useState(false)
  const [transparentFooter, setTransparentFooter] = useState(false)
  const [trimStart, setTrimStart] = useState<number>(start ?? 0)
  const [trimEnd, setTrimEnd] = useState<number>(end ?? 0)
  const [videoDuration, setVideoDuration] = useState<number>(NaN)
  const [maxPreviewLength, setMaxPreviewLength] = useState<number>(PREVIEW_LIMIT)
  const [swiperProgress, setSwiperProgress] = useState<number>(0)
  const [playerReady, setPlayerReady] = useState<boolean>(false)
  const playerRef = useRef<ReactPlayer>(null)
  const swiperRef = useRef<SwiperCore>()
  const { deviceOrientation, playerWidth, playerHeight } = useVideoPlayerOrientation(orientation)
  const { t } = useTranslation()

  // webm duration infinity fix
  const [needsReset, setNeedsReset] = useState(false)

  // webm fix, seek to low number to load video and get duration
  useLayoutEffect(() => {
    if (playerRef.current && playerReady && !playing && !isFinite(videoDuration) && !needsReset) {
      playerRef.current.seekTo(1e101, 'seconds')
      setNeedsReset(true)
    }
  }, [needsReset, playerReady, playing, videoDuration])

  // webm fix, return seek to 0
  useLayoutEffect(() => {
    const intervalId = setInterval(() => {
      if (needsReset && playerRef.current && isFinite(playerRef.current.getDuration()) && !isFinite(videoDuration)) {
        setVideoDuration(playerRef.current.getDuration())
        setNeedsReset(false)
        playerRef.current.seekTo(0, 'seconds')
        clearInterval(intervalId)
      }
    }, 50)

    return () => {
      clearInterval(intervalId)
    }
  }, [needsReset, videoDuration])

  useEffect(() => {
    if (isFinite(videoDuration)) {
      const maxEnd = Math.min(PREVIEW_LIMIT, videoDuration)

      setMaxPreviewLength(maxEnd)
      // if (end == null) {
      setTrimEnd(maxEnd)
      // } else if (start != null && end != null) {
      //   // const fromStart =
      //   //   (0 - trimStart) / maxPreviewLength;
      //   // const midSlider = sliderValues[0] + fromStart * 100;
      //   const centerDiff = (end - start) / 2;
      //   const centerProgress = (start + centerDiff) / videoDuration;
      //   // const sliderOffset = centerProgress * (videoDuration - maxPreviewLength);
      //   // const startTmp =
      //   //   sliderOffset + (sliderValues[0] / 100) * maxPreviewLength;
      //   // const endTmp = Math.min(
      //   //   sliderOffset + (sliderValues[2] / 100) * maxPreviewLength,
      //   //   duration
      //   // );
      //   const sliderStart = 50 - centerDiff / maxEnd * 100;
      //   const sliderEnd = 50 + centerDiff / maxEnd * 100;
      //   swiperRef.current?.setProgress(centerProgress);
      //   setSliderValues([sliderStart, 50, sliderEnd]);
      // }
    }
  }, [
    videoDuration
    // start,
    // end
  ])

  useEffect(() => {
    if (deviceOrientation) {
      if (deviceOrientation.type.includes('landscape')) {
        !transparentFooter && setTransparentFooter(true)
      } else {
        transparentFooter && setTransparentFooter(false)
      }
    }
  }, [deviceOrientation, orientation])

  useEffect(() => {
    if (playerRef.current && playerReady && !playing && isFinite(videoDuration)) {
      const sliderOffset = swiperProgress * (videoDuration - maxPreviewLength)
      const startTmp = sliderOffset + (sliderValues[0] / 100) * maxPreviewLength
      const endTmp = Math.min(sliderOffset + (sliderValues[2] / 100) * maxPreviewLength, videoDuration)

      setTrimStart(startTmp)
      setTrimEnd(endTmp)
      playerRef.current.seekTo(startTmp, 'seconds')
    }
  }, [sliderValues, swiperProgress, maxPreviewLength, playerReady, playing, videoDuration])

  if (!deviceOrientation) return null

  return (
    <div
      className={`editVideoModal ${deviceOrientation.type.includes('portrait') ? 'editVideoModal--portrait' : ''} ${
        deviceOrientation.type.includes('landscape') ? 'editVideoModal--landscape' : ''
      }`}
    >
      <div className='editVideoModal__player'>
        <div className='editVideoModal__player__wrapper'>
          <div
            className={`editVideoModal__player__icon editVideoModal__player__icon${
              playing ? '--playing' : '--notPlaying'
            }`}
            onClick={() => setPlaying(playing => !playing)}
          >
            {playing ? <IconPauseFill /> : <IconPlayFill />}
          </div>
          <ReactPlayer
            ref={playerRef}
            url={vidSrc}
            width={playerWidth}
            height={playerHeight}
            style={{ display: 'flex' }}
            controls={false}
            muted={false}
            playing={playing}
            onPlay={() => !playing && setPlaying(true)}
            onPause={() => playing && setPlaying(false)}
            onEnded={() => setPlaying(false)}
            progressInterval={100}
            onReady={() => {
              setPlayerReady(true)
            }}
            onDuration={duration => {
              setVideoDuration(duration)
            }}
            onProgress={({ playedSeconds }) => {
              if (playing) {
                const fromStart = (playedSeconds - trimStart) / maxPreviewLength
                const midSlider = sliderValues[0] + fromStart * 100
                setSliderValues([sliderValues[0], midSlider, sliderValues[2]])

                if (playedSeconds >= trimEnd) {
                  setPlaying(false)
                  return
                }
              }
            }}
          />

          {/* <div className="editVideoModal__player__timer">
            {`${
              playerRef.current &&
              formatVideoTime(playerRef.current.getCurrentTime())
            } / ${
              playerRef.current &&
              formatVideoTime(playerRef.current.getDuration())
            }`}
          </div> */}
        </div>
        {/* <div className="editVideoModal__crop__block">

        </div> */}
        <div
          className={`editVideoModal__slider ${sliderValues[0] > 0 ? 'slid-right' : ''} ${
            sliderValues[2] < 100 ? 'slid-left' : ''
          }`}
        >
          <div className='editVideoModal__slider__timer'>
            {`${playerRef.current && formatVideoTime(playerRef.current.getCurrentTime())} / ${
              playerRef.current && formatVideoTime(trimEnd)
            }`}
          </div>
          <Swiper
            onInit={(core: SwiperCore) => {
              swiperRef.current = core
            }}
            slidesPerView={4} // was 4
            resistance={true}
            freeMode={true}
            modules={[FreeMode]}
            onProgress={(swiper: SwiperClass, prog: number) => {
              setPlaying(false)
              setSwiperProgress(prog)
              setSliderValues([sliderValues[0], sliderValues[0], sliderValues[2]])
            }}
          >
            {thumbnails?.map((thumb, idx) => {
              return (
                <SwiperSlide key={idx}>
                  <div className='editVideoModal__slider__image'>
                    <img src={thumb} alt='' />
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
          <div className='editVideoModal__slider__wrapper'>
            <ReactSlider
              className='horizontal-slider'
              thumbClassName='slider-thumb'
              trackClassName='slider-track'
              value={sliderValues}
              onChange={(value, idx) => {
                if (playerRef?.current) {
                  setPlaying(false)
                  setSliderValues([value[0], value[0], value[2]])
                }
              }}
              pearling
            />
          </div>
        </div>
      </div>
      <div className={`editPreviewModal__footer ${transparentFooter ? 'editPreviewModal__footer--transparent' : ''}`}>
        <Button
          text={t('cancel')}
          color='grey'
          font='mont-14-normal'
          width='13'
          height='3'
          customClass='dateModal_date__button'
          clickFn={cancelCb}
        />
        <Button
          text={t('save')}
          color='black'
          font='mont-14-normal'
          width='13'
          height='3'
          customClass='dateModal_date__button'
          disabled={!trimStart && !trimEnd}
          clickFn={() => {
            confirmCb({
              startTime: trimStart,
              endTime: trimEnd,
              path: storageSrc
            })
            cancelCb()
          }}
        />
      </div>
    </div>
  )
}

export default EditVideoModal
