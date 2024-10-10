import { FC } from 'react'
import classNames from 'classnames'

import { useTranslation } from 'react-i18next'
import { IconCloseXSm } from '../../assets/svg/sprite'

import './_processingFile.scss'

interface Props {
  percentage: number
  onAbort: () => void
  className?: string
}

const ProcessingFile: FC<Props> = ({ percentage, onAbort, className }) => {
  const { t } = useTranslation()
  return (
    <div className={classNames('processingFile', className)}>
      <div className='processingFile__abort' onClick={onAbort}>
        <IconCloseXSm />
      </div>
      <div className='processingFile__wrapper'>
        <div className='processingFile__loader'>
          <span className='processingFileLoader'></span>
        </div>
      </div>

      <div className='processingFile__progress'>
        <div className='processingFile__text'>{t('processing')}</div>
        <div className='processingFile__progress--bar'>
          <progress max='100' value={percentage}></progress>
        </div>
      </div>
    </div>
  )
}

export default ProcessingFile
