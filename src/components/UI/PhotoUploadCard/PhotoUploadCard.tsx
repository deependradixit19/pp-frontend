import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { IconClose, IconFile, IconTrashcan } from '../../../assets/svg/sprite'
import './_photoUploadCard.scss'

interface Props {
  name: string
  progressValue: number
  type: string
  size: number
  abortFn: () => void
}

const PhotoUploadCard: FC<Props> = ({ name, progressValue, type, size, abortFn }) => {
  const { t } = useTranslation()
  function formatBytes(bytes: number, decimals: number = 2) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }
  return (
    <div className='photoUploadCard'>
      <div className='photoUploadCard__icon'>
        <IconFile />
        <span>{type}</span>
      </div>
      <div className='photoUploadCard__main'>
        <div className='photoUploadCard__main--top'>
          <div className='photoName'>{name}</div>
          <div className='photoPercent'>{progressValue < 100 ? progressValue + '%' : t('completed')}</div>
        </div>
        <div className='photoUploadCard__main--progress'>
          <progress max='100' value={progressValue}></progress>
        </div>
        <div className='photoUploadCard__main--bottom'>{formatBytes(size)}</div>
      </div>
      <div className='photoUploadCard__action' onClick={() => abortFn()}>
        {progressValue < 100 ? (
          <div className='circleWrapper'>
            <IconClose />
          </div>
        ) : (
          <IconTrashcan />
        )}
      </div>
    </div>
  )
}

export default PhotoUploadCard
