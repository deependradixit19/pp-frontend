import { FC } from 'react'
import { IconText } from '../../../assets/svg/sprite'

interface Props {
  className?: string
  onClick?: () => void
  text?: string
}

const AddTextButton: FC<Props> = ({ className, text, onClick }) => {
  return (
    <div className={`addTextButton ${className ?? ''}`} onClick={onClick}>
      <IconText />
      {text ? <div className='addTextButton__text'>{text}</div> : null}
    </div>
  )
}

export default AddTextButton
