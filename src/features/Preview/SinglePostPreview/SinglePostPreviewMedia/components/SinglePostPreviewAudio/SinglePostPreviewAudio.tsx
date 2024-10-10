import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { IconSwipeUp } from '../../../../../../assets/svg/sprite'
import AudioMessage from '../../../../../../components/UI/AudioMessage/AudioMessage'
import { useOrientation } from '../../../../../../helpers/helperHooks'
import { IFile } from '../../../../../../types/interfaces/IFile'
import { IPostFile } from '../../../../../../types/interfaces/ITypes'

interface Props {
  mediaItem: IFile
  postFile: IPostFile
  minimized: boolean
  isFirstPost: boolean
  isActive: boolean
  showControls: boolean
  toggleControls: () => void
}

const SinglePostPreviewAudio: FC<Props> = ({
  mediaItem,
  postFile,
  minimized,
  isFirstPost,
  isActive,
  showControls,
  toggleControls
}) => {
  const deviceOrientation = useOrientation()
  const { t } = useTranslation()

  if (!deviceOrientation) return null
  return (
    <div className={`preview__file preview__file__sound`}>
      {minimized ? (
        <div className='preview__minimized'>
          <AudioMessage
            audioBlob={mediaItem.url}
            audioReady={true}
            waveColor='gray'
            waveBackgroundColor='transparent'
            key={mediaItem.id}
          />
          <div className='preview__minimized__content'>
            <div className='preview__minimized__content--top'>
              <div className='header__avatar'>
                <img src={postFile.minimizedAvatar} alt={t('placeholder')} />
              </div>
              <div className='header__name'>{postFile.minimizedName}</div>
            </div>
            <div className='preview__minimized__content--bottom'>
              <div className='content__text'>{postFile.text}</div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className='preview__file__sound--container'>
            <AudioMessage
              audioBlob={mediaItem.url}
              audioReady={true}
              customClass={`newpost__audiomessage newpost__audiomessage--active`}
              waveColor='gray'
              waveBackgroundColor='transparent'
              key={mediaItem.id}
            />
          </div>
          {isFirstPost && (
            <div className='preview__swipe--icon'>
              <IconSwipeUp
              // opacity={
              //   deviceOrientation.type.includes(
              //     'portrait'
              //   )
              //     ? orientation === 'landscape'
              //       ? 0.5
              //       : 1
              //     : 1
              // }
              />
              <p
              // style={{
              //   opacity:
              //     deviceOrientation.type.includes(
              //       'portrait'
              //     )
              //       ? orientation === 'landscape'
              //         ? 0.5
              //         : 1
              //       : 1,
              // }}
              >
                {t('swipeUpForNextPost')}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SinglePostPreviewAudio
