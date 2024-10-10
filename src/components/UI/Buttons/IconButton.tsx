import { FC } from 'react'
import './_iconButton.scss'

const IconButton: FC<{
  icon: string | JSX.Element | JSX.Element[]
  clickFn?: any
  desc?: string
  input?: any
  type?: string
  size?: string
  customClass?: string
  disabled?: boolean
}> = ({ icon, clickFn, desc, input, type, size, customClass, disabled = false }) => {
  return (
    <div
      className={`${disabled ? 'disabled' : ''} iconbutton${type ? ` iconbutton--${type}` : ''}${
        customClass ? ` ${customClass}` : ''
      }${size ? ` iconbutton--${size}` : ''}`}
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        clickFn && e.stopPropagation()
        clickFn && clickFn()
      }}
    >
      {typeof icon === 'string' ? <img src={icon} alt={desc} /> : icon}

      {input ? input : ''}
    </div>
  )
}

export default IconButton
