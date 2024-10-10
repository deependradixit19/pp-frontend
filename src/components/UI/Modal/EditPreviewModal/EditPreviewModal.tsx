import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react'
import './_editPreviewModal.scss'
import ReactPlayer from 'react-player'
import { useTranslation } from 'react-i18next'
import { IconCheckmarkSm, IconPauseFill, IconPlayFill, IconScissors } from '../../../../assets/svg/sprite'
import SwitchButton from '../../../Common/SwitchButton/SwitchButton'
import Button from '../../Buttons/Button'
import { useModalContext } from '../../../../context/modalContext'
import EditVideoModal from '../EditVideo/EditVideoModal'
import { useOrientation } from '../../../../helpers/helperHooks'
import { useUserContext } from '../../../../context/userContext'

interface Props {
  defaultPreview: string
  storageSrc: string
  cancelCb: () => void
  confirmCb: (
    data:
      | {
          imagePrev: { previewUrl: string; defaultPrev: string }
        }
      | {
          videoPrev: { start: number; end: number; defaultPrev: string }
        }
  ) => void
  orientation?: string
  thumbnails?: string[]
  thumbnailIndex?: number
  trimPreview?: {
    start: number
    end: number
  }
  thumbType?: 'clip' | 'thumb'
}
const EditPreviewModal: FC<Props> = ({
  defaultPreview,
  storageSrc,
  cancelCb,
  confirmCb,
  orientation,
  thumbnails,
  thumbnailIndex,
  trimPreview,
  thumbType
}) => {
  const userData = useUserContext()
  const [videoPreviewActive, setVideoPreviewActive] = useState(
    trimPreview != null ||
      (thumbnailIndex == null && thumbType === 'clip') ||
      (thumbnailIndex == null && thumbType !== 'thumb' && userData?.post_preview_type === 'video')
  )
  const [wrapperStyle, setWrapperStyle] = useState<any>(null)
  const [selectedPreviewIdx, setSelectedPreviewIdx] = useState<number>(thumbnailIndex ?? 0)
  const [playing, setPlaying] = useState(false)
  const [videoTrimData, setVideoTrimData] = useState<{
    start: number
    end: number
    path: string
  }>({
    start: trimPreview?.start ?? 0.0,
    end: trimPreview?.end ?? 10.0,
    path: storageSrc
  })
  const [noChanges, setNoChanges] = useState(true)
  // const [processing, setProcessing] = useState(false);

  const modalData = useModalContext()
  const deviceOrientation = useOrientation()
  const { t } = useTranslation()

  const playerRef = useRef<ReactPlayer>(null)

  useLayoutEffect(() => {
    const height = window.innerHeight - 376
    setWrapperStyle({ height: `${height}px` })
  }, [])

  // useEffect(() => {
  //   if (trimPreview == null && userData?.post_preview_type === 'picture') {
  //     setVideoPreviewActive(false);
  //   } else {
  //     setVideoPreviewActive(true);
  //   }
  // }, [trimPreview, userData]);

  useEffect(() => {
    if (playerRef.current && videoTrimData) {
      playerRef.current.seekTo(videoTrimData.start, 'seconds')
    }
  }, [videoTrimData, playerRef, playing])

  const showEditVideoPreview = (videoPreview: any, storageSrc: string) => {
    modalData.addModal(
      '',
      <EditVideoModal
        vidSrc={videoPreview}
        storageSrc={storageSrc}
        thumbnails={thumbnails}
        orientation={orientation}
        // start={trimPreview?.start}
        // end={trimPreview?.end}
        cancelCb={() => modalData.clearModal()}
        confirmCb={data => {
          setNoChanges(false)
          setVideoTrimData({
            start: data.startTime,
            end: data.endTime,
            path: data.path
          })
        }}
      />,
      true,
      true,
      'editPreview'
    )
  }

  return (
    <div
      className={`editPreviewModal ${
        deviceOrientation?.type.includes('landscape') ? 'editPreviewModal--landscape' : ''
      }`}
    >
      <div className='editPreviewModal__top'>
        <div className='editPreviewModal__top__cover'>
          {videoPreviewActive ? (
            <>
              <div
                className={`editPreviewModal__player__icon editPreviewModal__player__icon${
                  playing ? '--playing' : '--notPlaying'
                }`}
                onClick={() => setPlaying(playing => !playing)}
              >
                {playing ? <IconPauseFill /> : <IconPlayFill />}
              </div>
              {/* {processing ? (
                <div className="processingFile__loader__backdrop">
                  <div className="processingFile__loader">
                    <span className="processingFileLoader"></span>
                  </div>
                </div>
              ) : (
                <div
                  className={`editPreviewModal__player__icon editPreviewModal__player__icon${
                    playing ? '--playing' : '--notPlaying'
                  }`}
                  onClick={() => setPlaying((playing) => !playing)}
                >
                  {playing ? <IconPauseFill /> : <IconPlayFill />}
                </div>
              )} */}

              <ReactPlayer
                ref={playerRef}
                url={defaultPreview}
                width='100%'
                height='22.5rem'
                controls={false}
                muted={false}
                playing={playing}
                onProgress={({ playedSeconds }) => {
                  if (videoTrimData) {
                    if (playedSeconds >= videoTrimData.end) {
                      setPlaying(false)
                    }
                  }
                }}
              />
              <div
                className='editPreviewModal__circle'
                onClick={() => showEditVideoPreview(defaultPreview, storageSrc)}
              >
                <IconScissors />
              </div>
            </>
          ) : (
            <img src={thumbnails && thumbnails[selectedPreviewIdx]} alt='default preview' />
          )}
        </div>
        {/* {trim.isError && <p className="editPreviewModal__error">error</p>} */}
      </div>
      <div className='editPreviewModal__content'>
        <div className='editPreviewModal__content__header'>
          <div className='editPreviewModal__content__header__title'>{t('chooseACover')}</div>
          <div className='editPreviewModal__content__header__toggle'>
            <p>{t('videoPreview')}</p>
            <SwitchButton
              active={videoPreviewActive}
              toggle={() => {
                setNoChanges(false)
                setVideoPreviewActive(videoPreviewActive => !videoPreviewActive)
              }}
            />
          </div>
        </div>
        <div
          style={wrapperStyle}
          className={`editPreviewModal__content__list ${
            videoPreviewActive ? 'editPreviewModal__content__list--disabled' : ''
          }`}
        >
          {thumbnails &&
            thumbnails.map((thumbnail, idx) => (
              <div
                key={idx}
                className={`editPreviewModal__content__list__item ${
                  idx === selectedPreviewIdx ? 'editPreviewModal__content__list__item--active' : ''
                }`}
                onClick={() => {
                  setNoChanges(false)
                  setSelectedPreviewIdx(idx)
                }}
              >
                <div className='editPreviewModal__content__list__item__check'>
                  {idx === selectedPreviewIdx && <IconCheckmarkSm />}
                </div>
                <img src={thumbnail} alt='thumbnail' />
              </div>
            ))}
        </div>
      </div>
      <div className='editPreviewModal__footer'>
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
          disabled={noChanges}
          clickFn={() => {
            if (!videoPreviewActive && thumbnails) {
              confirmCb({
                imagePrev: {
                  previewUrl: thumbnails[selectedPreviewIdx],
                  defaultPrev: defaultPreview
                }
              })
            } else if (videoPreviewActive) {
              confirmCb({
                videoPrev: {
                  start: videoTrimData.start,
                  end: videoTrimData.end,
                  defaultPrev: defaultPreview
                }
              })
            }
            // if (videoPreviewActive) {
            // } else {

            // }
          }}
        />
      </div>
    </div>
  )
}

export default EditPreviewModal
