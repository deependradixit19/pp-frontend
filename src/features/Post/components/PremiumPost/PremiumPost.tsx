import { FC, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Carousel } from 'react-responsive-carousel'
import ReactPlayer from 'react-player'
import Button from '../../../../components/UI/Buttons/Button'
import { IPost, IPostMediaPreview } from '../../../../types/interfaces/ITypes'
import { IconPostPauseOutline, IconPostPlayOutline, IconPremiumPostLockedOutline } from '../../../../assets/svg/sprite'
import { AllIcons } from '../../../../helpers/allIcons'
import { usePreviewContext } from '../../../../context/previewContext'

import Video from '../../../../assets/video/test-video-1.mp4'
import Image from '../../../../assets/images/cover-bg.jpg'

// import placeholderCover from '../../../../assets/images/home/cover_placeholder.png';

interface Props {
  postIndex: number
  postData: IPost
  // previewEnabled: boolean;
  dataQuery: any[]
  // previewUrl: string;
  purchaseCb: () => void
  processing: boolean
}
const PremiumPost: FC<Props> = ({
  postIndex,
  postData,
  // previewEnabled,
  dataQuery,
  purchaseCb,
  processing
}) => {
  const [previewFiles, setPreviewFiles] = useState<IPostMediaPreview[]>([])
  const [videoPlaying, setVideoPlaying] = useState<boolean>(false)

  const previewData = usePreviewContext()
  const { t } = useTranslation()

  const videoPlayerRef = useRef<any>(null)

  useEffect(() => {
    if (postData) {
      const previewData: IPostMediaPreview[] = [...postData.photos_preview, ...postData.videos_preview].sort(
        (a, b) => a.order - b.order
      )
      setPreviewFiles(previewData)
    }
  }, [postData])

  if (!previewFiles.length && postData.body) {
    return (
      <div className='post-tags-wrapper post-tags-wrapper--premium'>
        <div className='post__files__file post__files__file--no-media'>{postData.body}</div>
      </div>
    )
  }
  return (
    <>
      <div className='post-tags-wrapper post-tags-wrapper--premium'>
        <Carousel
          axis='horizontal'
          autoPlay={true}
          interval={600000}
          showArrows={false}
          showIndicators={false}
          infiniteLoop={true}
          showThumbs={false}
          showStatus={false}
          className='post__files__carousel'
          // onChange={(key) => updateCounter(key)}
        >
          {previewFiles.map((file: IPostMediaPreview, key: number) => {
            if (file.preview && (file.preview.type === 'thumb' || file.preview.type === 'blur')) {
              return (
                <div
                  key={key}
                  className={`post__files__file post__files__file--img`}
                  onClick={() => {
                    if (previewData.minimized) {
                      previewData.updateSelectedPost(postIndex, key, 'photo', postData, dataQuery)
                      previewData.handleMinimize(false)
                    } else {
                      previewData.addModal(postIndex, key, 'photo', postData, dataQuery)
                    }
                  }}
                >
                  <img src={file.preview.src} alt='Post file' />
                  <div className='post__cta'>
                    <div className='post__cta__icon'>
                      <IconPremiumPostLockedOutline />
                    </div>
                    <p className='post__cta__text'>{t('premium')}</p>
                    <Button
                      text={
                        <p>
                          {t('buy')} <span className='post__cta__button__price'>${postData.price}</span>
                        </p>
                      }
                      color='black'
                      font='mont-14-normal'
                      height='3'
                      width='fit'
                      padding='2'
                      customClass='post__cta__button'
                      clickFn={() => purchaseCb()}
                      disabled={processing}
                    />
                  </div>
                </div>
              )
            } else if (file.preview && file.preview.type === 'clip') {
              return (
                <div
                  key={key}
                  className='post__files__file'
                  onClick={() => {
                    if (previewData.minimized) {
                      previewData.updateSelectedPost(postIndex, key, 'video', postData, dataQuery)
                      previewData.handleMinimize(false)
                    } else {
                      previewData.addModal(postIndex, key, 'video', postData, dataQuery)
                    }
                  }}
                >
                  <ReactPlayer
                    width='100%'
                    height='100%'
                    url={file.preview.src}
                    controls={false}
                    playing={videoPlaying}
                    // onPlay={() => setVideoPlaying(true)}
                    // onEnded={() => setVideoPlaying(false)}
                    ref={videoPlayerRef}
                  />
                  {videoPlayerRef?.current ? (
                    <div className='post__files__file__duration'>{videoPlayerRef?.current?.getDuration()}</div>
                  ) : (
                    ''
                  )}
                  <div className='post__cta'>
                    <div
                      className='post__cta__icon'
                      onClick={(e: any) => {
                        e.stopPropagation()
                        // setVideoPlaying(!videoPlaying);
                      }}
                    >
                      {videoPlaying ? <IconPostPauseOutline /> : <IconPostPlayOutline />}
                    </div>
                    <p className='post__cta__text'>{t('premium')}</p>
                    <Button
                      text={
                        <p>
                          {t('buy')} <span className='post__cta__button__price'>${postData.price}</span>
                        </p>
                      }
                      color='black'
                      font='mont-14-normal'
                      height='3'
                      width='fit'
                      padding='2'
                      customClass='post__cta__button'
                      clickFn={() => purchaseCb()}
                      disabled={processing}
                    />
                  </div>
                </div>
              )
            } else {
              return <div key={key}>other</div>
            }
          })}
        </Carousel>
      </div>
    </>
  )
}

export default PremiumPost
