import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { IconSwipeUp } from '../../../../../../assets/svg/sprite'
import { useOrientation } from '../../../../../../helpers/helperHooks'
import { renderPostText } from '../../../../../../helpers/postHelpers'
import { IFile } from '../../../../../../types/interfaces/IFile'
import { IPostFile } from '../../../../../../types/interfaces/ITypes'
import VideoPlayer from '../../../../../VideoPlayer/VideoPlayer'

interface Props {
  mediaItem: IFile
  postFile: IPostFile
  minimized: boolean
  isFirstPost: boolean
  isActive: boolean
  showControls: boolean
  videoUserId: number
  toggleControls: () => void
}

const SinglePostPreviewVideo: FC<Props> = ({
  mediaItem,
  postFile,
  minimized,
  isFirstPost,
  isActive,
  showControls,
  videoUserId,
  toggleControls
}) => {
  const deviceOrientation = useOrientation()
  const { t } = useTranslation()

  const orientation = mediaItem.orientation ? mediaItem.orientation.toLowerCase() : ''

  if (!deviceOrientation) return null
  return (
    <div className={`preview__file ${orientation}`}>
      {minimized ? (
        <div className='preview__minimized'>
          <VideoPlayer
            url={mediaItem.url}
            showControls={true}
            minimized={minimized}
            setShowControls={toggleControls}
            isActive={isActive}
            shouldTrackPlayed={true}
            videoId={mediaItem.id}
            videoUserId={videoUserId}
          />
          <div className='preview__minimized__content'>
            <div className='preview__minimized__content--top'>
              <div className='header__avatar'>
                <img src={postFile.minimizedAvatar} alt={t('placeholder')} />
              </div>
              <div className='header__name'>{postFile.minimizedName}</div>
            </div>
            <div className='preview__minimized__content--bottom'>
              <div className='content__text'>{renderPostText(postFile.text || '', postFile.mentions)}</div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <VideoPlayer
            url={mediaItem.url}
            showControls={showControls}
            minimized={minimized}
            setShowControls={toggleControls}
            isActive={isActive}
            shouldTrackPlayed={true}
            videoId={mediaItem.id}
            videoUserId={videoUserId}
          />
          {isFirstPost && (
            <div className='preview__swipe--icon'>
              <IconSwipeUp
                opacity={deviceOrientation.type.includes('portrait') ? (orientation === 'landscape' ? 0.5 : 1) : 1}
              />
              <p
                style={{
                  opacity: deviceOrientation.type.includes('portrait') ? (orientation === 'landscape' ? 0.5 : 1) : 1
                }}
              >
                {t('swipeUpForNextPost')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SinglePostPreviewVideo
