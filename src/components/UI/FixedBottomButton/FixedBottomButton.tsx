import { FC } from 'react'
import './_fixedBottomButton.scss'

const FixedBottomButton: FC<{
  src?: string
  alt?: string
  text: string
  clickFn?: () => void
  customClass?: string
  disabled?: boolean
}> = ({ src, alt, text, clickFn, customClass, disabled }) => {
  return (
    <div
      className={`fixedbb ${customClass ? customClass : ''} ${disabled ? 'fixedbb--disabled' : ''}`}
      onClick={clickFn}
    >
      <img src={src} alt={alt} />
      {text}
    </div>
  )
}

export default FixedBottomButton
