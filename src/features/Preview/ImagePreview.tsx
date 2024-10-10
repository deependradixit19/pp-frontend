import { FC } from 'react'
import { ITextObject } from '../../types/interfaces/ITextObject'
import CaptionTextOverlay from '../PhotoEdit/CaptionTextOverlay/CaptionTextOverlay'

const ImagePreview: FC<{ src: string; textObject?: ITextObject }> = ({ src, textObject }) => {
  return (
    <>
      <div className='swiper-zoom-container'>
        <img className='preview__file__image' src={src} alt='Preview' />
      </div>
      <CaptionTextOverlay text={textObject?.value} xPercent={textObject?.x} yPercent={textObject?.y} zIndex={5} />
    </>
  )
}

export default ImagePreview
