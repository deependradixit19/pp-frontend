import { FC, useRef, useState } from 'react'
import './_editImageModal.scss'
import { Cropper } from 'react-cropper'
import { useTranslation } from 'react-i18next'
import { Icons } from '../../../../helpers/icons'
import { useModalContext } from '../../../../context/modalContext'

import ImgInCircle from '../../ImgInCircle/ImgInCircle'
import 'cropperjs/dist/cropper.css'

const EditImageModal: FC<{
  imgSrc: string
  confirmEdit?: any
  imgId?: number
  imgName?: string
}> = ({ imgSrc, confirmEdit, imgId, imgName }) => {
  const [cropActive, setCropActive] = useState<boolean>(false)
  const modalData = useModalContext()
  const cropperRef = useRef<HTMLImageElement>(null)
  const { t } = useTranslation()

  const cropImage = async () => {
    if (cropActive) {
      const imageElement: any = cropperRef?.current
      const cropper: any = imageElement?.cropper
      const croppedImg = cropper.getCroppedCanvas().toDataURL()
      let file = await fetch(croppedImg)
        .then(r => r.blob())
        .then(blobFile => new File([blobFile], `${imgName}`, { type: 'image/png' }))

      confirmEdit(file, imgId)
    }

    modalData.clearModal()
  }

  return (
    <div className='editImageModal'>
      <div className='editImageModal__crop editImageModal__crop__editimage'>
        <div className='editImageModal__block'>
          {!cropActive ? (
            <img src={imgSrc} alt={t('uploadedImg')} className='editImageModal__block--img' />
          ) : (
            <Cropper
              src={imgSrc}
              style={{ maxHeight: '100%', maxWidth: '100%' }}
              viewMode={1}
              dragMode='move'
              ref={cropperRef}
              rotatable={true}
            />
          )}
        </div>
        <div className='editImageModal__actions'>
          <ImgInCircle
            type='modal'
            customClass='editImageModal__actions__action'
            clickFn={() => modalData.clearModal()}
          >
            <img src={Icons.back} alt={t('return')} />
          </ImgInCircle>
          <ImgInCircle
            type='modal'
            customClass='editImageModal__actions__action'
            clickFn={() => setCropActive(!cropActive)}
          >
            <img src={Icons.cropimg} alt={t('cropPic')} />
          </ImgInCircle>
          <ImgInCircle type='modal' customClass='editImageModal__actions__action'>
            <img src={Icons.reload} alt={t('reload')} />
          </ImgInCircle>
          <ImgInCircle type='modal' customClass='editImageModal__actions__action' clickFn={cropImage}>
            <img src={Icons.checkmark} alt={t('accept')} />
          </ImgInCircle>
        </div>
      </div>
    </div>
  )
}

export default EditImageModal
