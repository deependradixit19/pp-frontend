import { FC, useState, useRef, useEffect } from 'react'
import ReactPlayer from 'react-player'
import style from './_vault_card_grouped.module.scss'
import { IconPlayOutline, IconPauseFill, IconCameraOutline, IconImageOutline } from '../../../../assets/svg/sprite'
import FullscreenMessage from '../../../../features/Messaging/Message/components/FullscreenMessage/FullscreenMessage'

const VaultCardGrouped: FC<{
  media: any
  onCirlceClick: any
  selected: boolean
  selectedText: any
  grouped: boolean | string
}> = ({ media, onCirlceClick, selected, selectedText, grouped }) => {
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [videoDuration, setVideoDuration] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    setVideoPlaying(false)
  }, [previewOpen])

  const renderDateTags = () => {
    const date = new Date(media.created_at)
    const monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return (
      <div className={style.media_tags_date_container}>
        <div className={style.media_tags_background}></div>
        <div className={style.media_tags_date_text}>
          {monthArray[date.getMonth()]} {date.getDate()}
        </div>
      </div>
    )
  }
  const renderTags = () => {
    if (media.post) {
      if (grouped) {
        if (media.post.videos?.length > 0 || media.post.photos?.length > 0) {
          return (
            <>
              <div className={style.media_bottom_tags_container}>
                {((media.post.videos.length > 0 && media.post.photos.length > 0) ||
                  (media.post.videos.length > 1 && media.post.photos.length === 0)) && (
                  <div className={style.media_bottom_tag}>
                    <div className={style.media_tags_background}></div>
                    <div className={style.media_bottom_tag_text}>
                      <IconCameraOutline width='16' height='12' color='#ffffff' />
                      <span>{media.post.videos.length}</span>
                    </div>
                  </div>
                )}
                {((media.post.photos.length > 0 && media.post.videos.length > 0) ||
                  (media.post.videos.length === 0 && media.post.photos.length > 1)) && (
                  <div className={style.media_bottom_tag}>
                    <div className={style.media_tags_background}></div>
                    <div className={style.media_bottom_tag_text}>
                      <IconImageOutline width='12' height='12' color='#ffffff' />
                      <span>{media.post.photos.length}</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )
        }
      } else {
        if (media.post.videos.length > 0) {
          return (
            <div className={style.media_bottom_tags_container}>
              <div className={style.media_bottom_tag}>
                <div className={style.media_tags_background}></div>
                <div className={style.media_bottom_tag_text}>
                  <span>{videoDuration}</span>
                </div>
              </div>
            </div>
          )
        }
      }
    }

    if (media.story) {
      if (!grouped) {
        if (!!media.story.video_src) {
          return (
            <div className={style.media_bottom_tags_container}>
              <div className={style.media_bottom_tag}>
                <div className={style.media_tags_background}></div>
                <div className={style.media_bottom_tag_text}>
                  <span>{videoDuration}</span>
                </div>
              </div>
            </div>
          )
        }
      }
    }

    if (media.message?.message) {
      if (grouped) {
        if (media.message.message.videos?.length > 0 || media.message.message.photos?.length > 0) {
          return (
            <>
              <div className={style.media_bottom_tags_container}>
                {((media.message.message.videos.length > 0 && media.message.message.photos.length > 0) ||
                  (media.message.message.videos.length > 1 && media.message.message.photos.length === 0)) && (
                  <div className={style.media_bottom_tag}>
                    <div className={style.media_tags_background}></div>
                    <div className={style.media_bottom_tag_text}>
                      <IconCameraOutline width='16' height='12' color='#ffffff' />
                      <span>{media.message.message.videos.length}</span>
                    </div>
                  </div>
                )}
                {((media.message.message.photos.length > 0 && media.message.message.videos.length > 0) ||
                  (media.message.message.videos.length === 0 && media.message.message.photos.length > 1)) && (
                  <div className={style.media_bottom_tag}>
                    <div className={style.media_tags_background}></div>
                    <div className={style.media_bottom_tag_text}>
                      <IconImageOutline width='12' height='12' color='#ffffff' />
                      <span>{media.message.message.photos.length}</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )
        }
      } else {
        if (media.message.message.videos.length > 0) {
          return (
            <div className={style.media_bottom_tags_container}>
              <div className={style.media_bottom_tag}>
                <div className={style.media_tags_background}></div>
                <div className={style.media_bottom_tag_text}>
                  <IconCameraOutline width='16' height='12' color='#ffffff' />
                  <span>{videoDuration}</span>
                </div>
              </div>
            </div>
          )
        }
      }
    }
  }

  const renderCardMedia = () => {
    if (media.post) {
      if (media.post.videos.length > 0) {
        return (
          <>
            <ReactPlayer
              width={'100%'}
              height={'100%'}
              url={media.post.videos[0].url}
              controls={false}
              onPlay={() => setVideoPlaying(true)}
              onEnded={() => setVideoPlaying(false)}
              playing={videoPlaying}
              ref={videoRef}
              onDuration={duration => {
                const minutes = Math.floor(duration / 60)
                const seconds = Math.floor(duration)
                const minutesString = '0' + minutes
                const secondsString = '0' + seconds
                const time = `${minutesString.slice(-2)} : ${secondsString.slice(-2)}`
                setVideoDuration(time)
              }}
            />
            <div
              className={style.video_play}
              onClick={e => {
                e.stopPropagation()
                setVideoPlaying(!videoPlaying)
              }}
            >
              {!videoPlaying ? <IconPlayOutline color='#ffffff' /> : <IconPauseFill color='#ffffff' />}
            </div>
          </>
        )
      }
      if (media.post.photos.length > 0) {
        return <img className={style.media_image} src={media.post.photos[0].url} />
      }
    }
    if (media.story) {
      if (media.story.image_src) {
        return <img className={style.media_image} src={media.story.image_src} />
      }
      if (media.story.video_src) {
        return (
          <>
            <ReactPlayer
              width={'100%'}
              height={'100%'}
              url={media.story.video_src}
              controls={false}
              onPlay={() => setVideoPlaying(true)}
              onEnded={() => setVideoPlaying(false)}
              playing={videoPlaying}
              ref={videoRef}
              onDuration={duration => {
                const minutes = Math.floor(duration / 60)
                const seconds = Math.floor(duration)
                const minutesString = '0' + minutes
                const secondsString = '0' + seconds
                const time = `${minutesString.slice(-2)} : ${secondsString.slice(-2)}`
                setVideoDuration(time)
              }}
            />
            <div
              className={style.video_play}
              onClick={e => {
                e.stopPropagation()
                setVideoPlaying(!videoPlaying)
              }}
            >
              {!videoPlaying ? <IconPlayOutline color='#ffffff' /> : <IconPauseFill color='#ffffff' />}
            </div>
          </>
        )
      }
    }

    if (media.message?.message) {
      if (media.message.message.videos.length > 0) {
        return (
          <>
            <ReactPlayer
              width={'100%'}
              height={'100%'}
              url={media.message.message.videos[0].url}
              controls={false}
              onPlay={() => setVideoPlaying(true)}
              onEnded={() => setVideoPlaying(false)}
              playing={videoPlaying}
              ref={videoRef}
              onDuration={duration => {
                const minutes = Math.floor(duration / 60)
                const seconds = Math.floor(duration)
                const minutesString = '0' + minutes
                const secondsString = '0' + seconds
                const time = `${minutesString.slice(-2)} : ${secondsString.slice(-2)}`
                setVideoDuration(time)
              }}
            />
            <div
              className={style.video_play}
              onClick={e => {
                e.stopPropagation()
                setVideoPlaying(!videoPlaying)
              }}
            >
              {!videoPlaying ? <IconPlayOutline color='#ffffff' /> : <IconPauseFill color='#ffffff' />}
            </div>
          </>
        )
      }
      if (media.message?.message.photos.length > 0) {
        return <img className={style.media_image} src={media.message.message.photos[0].url} />
      }
    }
    return null
  }

  const combinedMedia = []
  if (media.post) {
    combinedMedia.push(media.post.videos)
    combinedMedia.push(media.post.photos)
  }
  if (media.message?.message) {
    combinedMedia.push(media.message.message.photos)
    combinedMedia.push(media.message.message.videos)
  }
  const mergedMedia: any = [].concat.apply([], combinedMedia)

  return (
    <div className={style.card_wrapper}>
      <div
        onClick={() => setPreviewOpen(true)}
        className={`${style.card_container} ${selected ? style.card_container_selected : ''}`}
      >
        <div
          onClick={e => {
            e.stopPropagation()
            onCirlceClick(media)
          }}
          className={`${style.cirlce} ${selected ? style.cirlce_selected : ''}`}
        >
          {selected && selectedText && selectedText}
        </div>
        {renderCardMedia()}
        {renderDateTags()}
        {renderTags()}
      </div>
      {previewOpen && <FullscreenMessage media={mergedMedia || []} closeFn={() => setPreviewOpen(false)} />}
    </div>
  )
}

export default VaultCardGrouped
