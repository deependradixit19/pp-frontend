import { FC, useState } from 'react'
import './_chatMediaFile.scss'
import ReactPlayer from 'react-player'
import { useTranslation } from 'react-i18next'
import { AllIcons } from '../../../helpers/allIcons'

const ChatMediaFile: FC<{
  type: string
  path: string
  allFiles?: Array<{
    id: number
    order: number
    thumbnail_src?: string | null
    url: string
  }>
  itemNumber: number
}> = ({ type, path }) => {
  const [videoPlaying, setVideoPlaying] = useState<boolean>(false)
  const { t } = useTranslation()

  const renderChatFile = () => {
    switch (type) {
      case 'image':
        return <img className='cmFile__image' src={path} alt={t('chatMediaFile')} />

      case 'video':
        return (
          <ReactPlayer height='100%' url={path} controls={false} className='cmFile__video' playing={videoPlaying} />
        )

      default:
        return <div>Okeh</div>
    }
  }

  return (
    <div className={`cmFile cmFile--${type}`}>
      {type === 'video' ? (
        <div
          className='cmFile__video__controls'
          onClick={e => {
            e.stopPropagation()
            type === 'video' && setVideoPlaying(!videoPlaying)
          }}
        >
          {!videoPlaying ? (
            <img src={AllIcons.video_play} className='cmFile__video__controls__icon' alt={t('play')} />
          ) : (
            <img src={AllIcons.video_pause} className='cmFile__video__controls__icon' alt={t('pause')} />
          )}
        </div>
      ) : (
        ''
      )}
      {renderChatFile()}
    </div>
  )
}

export default ChatMediaFile
