import { FC } from 'react'
import CaptionText from '../CaptionText/CaptionText'
import './_captionTextOverlay.scss'

interface Props {
  text?: string | null
  xPercent?: number | null
  yPercent?: number | null
  zIndex?: string | number
  className?: string
}

const CaptionTextOverlay: FC<Props> = ({ text, xPercent, yPercent, className, zIndex = 'auto' }) => {
  if (text == null) return null
  return (
    <div className={`caption__text__overlay ${className ?? ''}`} style={{ zIndex: zIndex }}>
      <div className={`caption__text__container`}>
        <CaptionText text={text ?? ''} xPercent={xPercent ?? 50} yPercent={yPercent ?? 50} />
      </div>
    </div>
  )
}

export default CaptionTextOverlay
