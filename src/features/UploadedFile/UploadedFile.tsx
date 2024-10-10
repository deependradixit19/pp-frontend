import React, { FC, useEffect, useRef, useState } from 'react'
import './_uploadedFile.scss'
import ReactPlayer from 'react-player'
import { useTranslation } from 'react-i18next'
import { Icons } from '../../helpers/icons'

import { IconLocked, IconPencil, IconUnlocked } from '../../assets/svg/sprite'
import { useUserContext } from '../../context/userContext'

const UploadedFile: FC<{
  type: string
  fileBlob: any
  cover?: boolean
  removeFile?: any
  toggleEdit?: any
  customClass?: string
  disablePlay?: boolean
  hasReorderCircle?: boolean
  reorderNumber?: number
  editPreview?: () => void
  imagePreview?: string
  trimmedVideo?: { start: number; end: number }
  isPremium?: boolean
  locked?: boolean
  handleToggleMediaLocked: () => void
  handleTogglePreviewOn?: () => void
  previewOn?: boolean
}> = ({
  type,
  fileBlob,
  cover,
  removeFile,
  toggleEdit,
  customClass,
  disablePlay,
  hasReorderCircle,
  reorderNumber,
  editPreview,
  imagePreview,
  trimmedVideo,
  isPremium,
  locked,
  handleToggleMediaLocked,
  handleTogglePreviewOn,
  previewOn
}) => {
  // TYPE === AUDIO

  const [playing, setPlaying] = useState<boolean>(false)
  const [videoPlaying, setVideoPlaying] = useState<boolean>(false)

  const audioRef = useRef<any>(null)
  const playerRef = useRef<ReactPlayer>(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (playerRef.current && trimmedVideo) {
      playerRef.current.seekTo(trimmedVideo.start, 'seconds')
    }
  }, [trimmedVideo, playerRef, videoPlaying])

  const displayUploadedFile = () => {
    switch (type) {
      case 'image':
        return <img src={fileBlob} alt={t('uploadedFile')} />

      case 'video':
        return (
          <>
            {imagePreview ? (
              <img style={{ width: 'auto', height: '100%' }} src={imagePreview} alt={t('preview')} />
            ) : (
              <>
                <ReactPlayer
                  ref={playerRef}
                  url={fileBlob}
                  width={175}
                  height='100%'
                  controls={false}
                  playing={videoPlaying}
                  onProgress={({ playedSeconds }) => {
                    if (trimmedVideo) {
                      if (playedSeconds >= trimmedVideo.end) {
                        setVideoPlaying(false)
                      }
                    }
                  }}
                />
                {!disablePlay ? (
                  !videoPlaying ? (
                    <img className='uploadedfile__play' src={Icons.play} alt={t('play')} />
                  ) : (
                    <img className='uploadedfile__play' src={Icons.stop} alt={t('stop')} />
                  )
                ) : (
                  ''
                )}
              </>
            )}
          </>
        )

      case 'audio':
        return (
          <>
            <audio
              ref={audioRef}
              className='uploadedfile__audioplayer'
              src={fileBlob}
              onEnded={() => setPlaying(false)}
            />
            {!playing ? (
              <img
                onClick={() => {
                  audioRef.current.play()
                  setPlaying(true)
                }}
                className='uploadedfile__play'
                src={Icons.play}
                alt={t('play')}
              />
            ) : (
              <img
                onClick={() => {
                  audioRef.current.pause()
                  setPlaying(false)
                }}
                className='uploadedfile__play'
                src={Icons.pause}
                alt={t('pause')}
              />
            )}
          </>
        )
    }
  }
  return (
    <div className={`uploadedfile__wrapper ${customClass ? customClass : ''}`}>
      {cover && type === 'image' && (
        <div className='uploadedfile__cover'>
          <div className='uploadedfile__cover__text'>{t('cover')}</div>
        </div>
      )}
      {type === 'video' && isPremium && (
        <div className='uploadedfile__cover' onClick={handleTogglePreviewOn}>
          <div className='uploadedfile__cover__text'>{previewOn ? 'Preview On' : 'Preview Off'}</div>
        </div>
      )}

      <div
        className={`uploadedfile ${locked ? 'uploadedfile--locked' : ''}  ${cover ? 'uploadedfile--cover' : ''} ${
          type === 'video' ? 'uploadedfile--video' : ''
        } ${type === 'audio' ? 'uploadedfile--audio' : ''}`}
        onClick={() => {
          if (type === 'image') {
            toggleEdit && toggleEdit()
          } else if (type === 'video') {
            toggleEdit && toggleEdit()
            !disablePlay && setVideoPlaying(!videoPlaying)
          }
        }}
      >
        {displayUploadedFile()}
      </div>
      {isPremium ? (
        <div className='uploadedfile__premium'>
          <div className='uploadedfile__premium__icon' onClick={handleToggleMediaLocked}>
            {locked ? <IconLocked /> : <IconUnlocked />}
          </div>
        </div>
      ) : (
        ''
      )}

      {removeFile ? (
        <div className='uploadedfile__remove'>
          <img
            src={Icons.close}
            alt={t('removeFile')}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              e.stopPropagation()
              removeFile()
            }}
          />
        </div>
      ) : (
        ''
      )}
      {hasReorderCircle ? (
        <div className='uploadedfile__reorder'>
          <span className='uploadedfile__reorder__number'>{reorderNumber !== -1 ? reorderNumber! + 1 : ''}</span>
        </div>
      ) : (
        ''
      )}
      {fileBlob ? (
        <div
          className='uploadedfile__preview'
          onClick={() => {
            editPreview && editPreview()
          }}
        >
          <span className='uploadedfile__reorder__icon'>
            <IconPencil />
          </span>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default UploadedFile
