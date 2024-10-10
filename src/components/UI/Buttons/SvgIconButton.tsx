import { FC } from 'react'
import './_iconButton.scss'

const SvgIconButton: FC<{
  icon: JSX.Element
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
      {icon}
      {input ? input : ''}
    </div>
  )
}

export default SvgIconButton
