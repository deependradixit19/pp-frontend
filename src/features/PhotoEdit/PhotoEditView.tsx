import { FC, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { addToast } from '../../components/Common/Toast/Toast'
import Button from '../../components/UI/Buttons/Button'
import Sidebar from '../../components/UI/Sidebar/Sidebar'
import SidebarItem from '../../components/UI/Sidebar/SidebarItem'
import { IPhoto } from '../../types/interfaces/IPhoto'
import DraggableTextContainer from './DraggableText/DraggableTextContainer'
import * as SvgIcons from '../../assets/svg/sprite'

import './_photoEdit.scss'

interface BaseProps {
  isOpen?: false
  handleClose: () => void
  handleSetPhotoData: (data: IPhoto) => void
}

type withImageFile = BaseProps & {
  imageFile: File
  photo?: IPhoto
}

type withPhoto = BaseProps & {
  photo: IPhoto
  imageFile?: File
}

type Props = withImageFile | withPhoto

const PhotoEditView: FC<Props> = ({ imageFile, photo, handleSetPhotoData, handleClose }) => {
  const [photoText, setPhotoText] = useState<string | null>(photo?.text?.value ?? '')
  const [photoFileUrl, setPhotoFileUrl] = useState<string>(photo?.url ?? photo?.path ?? '')
  const [dragging, setDragging] = useState<boolean>(false)
  const [textPosition, setTextPosition] = useState<number[] | null[]>([photo?.text?.x ?? 50.0, photo?.text?.y ?? 50.0])
  const [openTextEdit, setOpenTextEdit] = useState(!!(photo?.text?.value ?? false))
  const containerRef = useRef<HTMLDivElement>(null)
  const initialPosition = useMemo(() => [50, 50], [])

  const { t } = useTranslation()

  const validateText = (text: string | null) => {
    if (text !== null && text.length < 1) {
      addToast('error', t('textIsRequiredOrDragToDeleteIt.'))
      return false
    } else {
      return true
    }
  }

  const handleSave = () => {
    if (validateText(photoText)) {
      const textToSave = {
        value: photoText,
        x: textPosition[0],
        y: textPosition[1]
      }
      handleSetPhotoData({
        ...photo,
        text: textToSave
      })
      handleClose()
    }
  }

  useLayoutEffect(() => {
    if (imageFile) {
      const imageUrl = URL.createObjectURL(imageFile)
      setPhotoFileUrl(imageUrl)

      return () => {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [imageFile])

  const removeDraggableText = useCallback(() => {
    setOpenTextEdit(false)
    setPhotoText(null)
    setTextPosition([null, null])
  }, [])

  const handleSetCoordinates = useCallback(
    (x: number, y:number) => {
      if (x !== textPosition[0] || y !== textPosition[1]) {
        setTextPosition([x, y])
      }
    },
    [textPosition]
  )

  return (
    <div
      className='photoEdit'
      ref={containerRef}
      style={{
        backgroundImage: `url(${photoFileUrl})`
      }}
    >
      <div className={`photoEdit__header ${dragging ? 'hide' : ''}`}>
        <div className='photoEdit__header__title'>{t('edit')}</div>
      </div>
      <div className='photoEdit__container'>
        <DraggableTextContainer
          customClass='photoEdit__container__text'
          initialValue={photo?.text?.value ?? ''}
          initialX={photo?.text?.x ?? initialPosition[0]}
          initialY={photo?.text?.y ?? initialPosition[1]}
          isEditable={true}
          isOpen={openTextEdit}
          isDragging={dragging}
          setValue={t => setPhotoText(t)}
          setCoordinates={handleSetCoordinates}
          setIsDragging={setDragging}
          onRemove={removeDraggableText}
        />
      </div>
      <Sidebar>
        {!dragging && (
          <SidebarItem
            icon={<SvgIcons.IconText color='white' />}
            text={t('text')}
            onClick={() => setOpenTextEdit(true)}
          />
        )}
      </Sidebar>

      <div className={`photoEdit__footer ${dragging ? 'hide' : ''}`}>
        <Button text={t('cancel')} color='white' font='mont-14-normal' width='12' height='3' clickFn={handleClose} />
        <Button
          text={t('save')}
          color='black'
          font='mont-14-normal'
          width='13'
          height='3'
          clickFn={() => handleSave()}
          disabled={openTextEdit && !photoText}
        />
      </div>
    </div>
  )
}

export default PhotoEditView
