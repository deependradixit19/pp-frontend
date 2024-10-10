import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { IconSwipeUp } from '../../../../../../assets/svg/sprite'
import { useOrientation } from '../../../../../../helpers/helperHooks'
import { renderPostText } from '../../../../../../helpers/postHelpers'
import { IFile } from '../../../../../../types/interfaces/IFile'
import { IPostFile } from '../../../../../../types/interfaces/ITypes'
import ImagePreview from '../../../../ImagePreview'
import CaptionText from '../../../../../PhotoEdit/CaptionText/CaptionText'

interface Props {
  mediaItem: IFile
  postFile: IPostFile
  minimized: boolean
  isFirstPost: boolean
  toggleControls: () => void
}

const SinglePostPreviewImage: FC<Props> = ({ mediaItem, postFile, minimized, isFirstPost, toggleControls }) => {
  const deviceOrientation = useOrientation()
  const { t } = useTranslation()
  const orientation = mediaItem.orientation ? mediaItem.orientation.toLowerCase() : ''

  if (!deviceOrientation) return null
  return (
    <div className={`preview__file ${orientation}`}>
      {minimized ? (
        <div className='preview__minimized'>
          <img
            className='preview__file__image preview__file__image--minimized'
            src={mediaItem.url}
            alt={t('preview')}
          />
          <div className='preview__minimized__content'>
            <div className='preview__minimized__content--top'>
              <div className='header__avatar'>
                <img src={postFile.minimizedAvatar} alt={t('placeholder')} />
              </div>
              <div className='header__name'>{postFile.minimizedName}</div>
            </div>
            <div className='preview__minimized__content--bottom'>
              <div className='content__text'>
                {renderPostText(postFile.text || '', postFile.mentions)}
                {/* {postFile.text} */}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div onClick={toggleControls}>
          <img className='preview__background' src={mediaItem.url} alt={t('background')} />

          <ImagePreview src={mediaItem.url} textObject={mediaItem.text} />
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

export default SinglePostPreviewImage
