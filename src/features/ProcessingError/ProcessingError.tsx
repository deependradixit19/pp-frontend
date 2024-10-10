import { FC } from 'react'
import { IconCloseXSm } from '../../assets/svg/sprite'
import './_processingError.scss'

interface Props {
  uploadError: string
  onClose: () => void
}

const ProcessingError: FC<Props> = ({ uploadError, onClose }) => {
  return (
    <div className='processingError'>
      <div className='processingError__abort' onClick={onClose}>
        <IconCloseXSm />
      </div>
      <div className='processingError__text'>{uploadError}</div>
      <div className='processingError__wrapper'></div>
    </div>
  )
}

export default ProcessingError
