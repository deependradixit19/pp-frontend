import { FC } from 'react'
import './_repliedMessage.scss'

import ReactPlayer from 'react-player'
import { useTranslation } from 'react-i18next'

const RepliedMessage: FC<{
  type: string
  message: any
}> = ({ type, message }) => {
  const { t } = useTranslation()
  const renderFile = () => {
    const firstItem = [...message.photos, ...message.videos].sort((a, b) => a.order - b.order)

    if (firstItem.length > 0) {
      if (firstItem[0].url.includes('/image')) {
        return <img src={firstItem[0].url} alt={t('repliedImg')} />
      } else if (firstItem[0].url.includes('/video')) {
        return <ReactPlayer width='100%' height='100%' controls={false} url={firstItem[0].url} playing={false} />
      } else {
        return false
      }
    }
  }

  return (
    <div
      onClick={() => document.getElementById(message.id)?.scrollIntoView()}
      className={`repliedDM repliedDM--${type}`}
    >
      <p className='repliedDM__title'>{t('replied')}</p>
      <div className='repliedDM__body'>
        {message.body ? <p>{message.body}</p> : ''}
        {renderFile() ? <div className='repliedDM__body__attachments'>{renderFile()}</div> : ''}
      </div>
    </div>
  )
}

export default RepliedMessage
