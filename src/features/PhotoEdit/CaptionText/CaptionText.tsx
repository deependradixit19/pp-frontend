import { FC } from 'react'
import './_captionText.scss'

interface Props {
  text: string
  xPercent: number
  yPercent: number
  className?: string
}

const CaptionText: FC<Props> = ({ text, xPercent, yPercent, className }) => {
  return (
    <div
      className={`text__draggable text__draggable__caption ${className ?? ''}`}
      style={{
        transform: 'translate(-50%, -50%)',
        left: `${xPercent}%`,
        top: `${yPercent}%`
      }}
    >
      <span>{text}</span>
    </div>
  )
}

export default CaptionText
