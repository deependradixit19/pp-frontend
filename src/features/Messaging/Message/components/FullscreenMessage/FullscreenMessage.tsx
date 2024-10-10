import { FC, useState, useRef } from 'react'
import ReactPlayer from 'react-player'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperClass } from 'swiper'
import style from './_fullscreen_message.module.scss'
import messageStyles from '../../_message.module.scss'
import { IconPostPauseOutline, IconPlayOutline, IconCloseLarge } from '../../../../../assets/svg/sprite'
import VideoPlayer from '../../../../../features/VideoPlayer/VideoPlayer'
import CaptionTextOverlay from '../../../../PhotoEdit/CaptionTextOverlay/CaptionTextOverlay'

const FullscreenMessage: FC<{
  media: []
  closeFn: () => void
  startingIndex?: number
}> = ({ media, closeFn, startingIndex = 0 }) => {
  const [showControls, setShowControls] = useState(true)
  const [activeSlide, setActiveSlide] = useState<number>(startingIndex)
  const renderMedia = () => {
    if (media.length > 0) {
      return media.map((item: any, key: number) => {
        if (item.type === 'photo')
          return (
            <SwiperSlide key={key}>
              <div
                className={`${style.fullscreen_photo_container} ${
                  item.orientation === 'Landscape' ? style.fullscreen_photo_container_landscape : ''
                }`}
              >
                <div className={style.container_overlay}></div>
                <img
                  src={item.src || item.url || ''}
                  alt='message photo background'
                  className={`${style.fullscreen_photo_background}`}
                />
                <img src={item.src || item.url || ''} alt='message photo' className={`${style.fullscreen_photo}`} />
                <CaptionTextOverlay
                  text={item.text?.value}
                  xPercent={item.text?.x}
                  yPercent={item.text?.y}
                  zIndex={5}
                />
              </div>
            </SwiperSlide>
          )
        if (item.type === 'video')
          return (
            <SwiperSlide key={key}>
              <div className={style.container_overlay}></div>
              <VideoPlayer
                url={item.url || item.src || ''}
                minimized={false}
                isActive={activeSlide === key}
                showControls={showControls}
                setShowControls={() => setShowControls(!showControls)}
              />
            </SwiperSlide>
          )
      })
    }
    return null
  }

  return (
    <div className={style.container}>
      <div className={style.close_icon} onClick={closeFn}>
        <IconCloseLarge color='#ffffff' />
      </div>
      <Swiper
        initialSlide={startingIndex}
        onSlideChange={(swiper: SwiperClass) => {
          setActiveSlide(swiper.activeIndex)
        }}
        pagination={true}
      >
        {renderMedia()}
      </Swiper>
    </div>
  )
}

export default FullscreenMessage
