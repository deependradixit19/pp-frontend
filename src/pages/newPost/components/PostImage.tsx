import { FC } from 'react'
import './_reorder.scss'
import { useTranslation } from 'react-i18next'
import { useModalContext } from '../../../context/modalContext'
import EditImageModal from '../../../components/UI/Modal/EditImage/EditImageModal'
import UploadedFile from '../../../features/UploadedFile/UploadedFile'
import ProcessingFile from '../../../features/ProcessingFile/ProcessingFile'
import ProcessingError from '../../../features/ProcessingError/ProcessingError'
import { IMediaItem, IProgressInfo } from '../../../types/interfaces/ITypes'

const PostImage: FC<{
  isEdit: boolean
  editImage?: IMediaItem
  image?: File
  imagePreview?: any
  id: number
  processing: boolean
  percentage: any
  uploadError: string
  previewUrl: string
  locked: boolean
  isPremium: boolean
  editPreview: () => void
  abortUploadCb: () => void
  removeFile: (file: File) => void
  removeByUrl?: (url: string) => void
  removePreviewPhoto?: (id: number) => void
  reorderActive?: boolean
  reorderNumber?: number
  updateOrder?: any
  handleToggleMediaLocked: (idx: number) => void
}> = ({
  isEdit,
  editImage,
  image,
  imagePreview,
  id,
  processing,
  percentage,
  uploadError,
  previewUrl,
  locked,
  isPremium,
  editPreview,
  abortUploadCb,
  removeFile,
  removeByUrl,
  removePreviewPhoto,
  reorderNumber,
  reorderActive,
  updateOrder,
  handleToggleMediaLocked
}) => {
  const modalData = useModalContext()
  const { t } = useTranslation()

  const toggleImageEdit = (img: File, id: number) =>
    modalData.addModal(t('editImage'), <EditImageModal imgId={id} imgSrc={imagePreview} imgName={img.name} />)

  if (uploadError) {
    return <ProcessingError uploadError={uploadError} onClose={() => image && removeFile(image)} />
  }

  if (processing) {
    return (
      <ProcessingFile
        percentage={percentage}
        onAbort={() => {
          abortUploadCb()
          image && removeFile(image)
        }}
      />
    )
  }

  if (isEdit && imagePreview) {
    return (
      <UploadedFile
        type='image'
        fileBlob={imagePreview}
        removeFile={() => removeByUrl && removeByUrl(previewUrl)}
        toggleEdit={() => {
          if (!reorderActive) {
            // toggleImageEdit(image, id);
          } else {
            updateOrder()
          }
        }}
        customClass={` ${reorderActive ? 'newpost__reorder__file' : ''} `}
        hasReorderCircle={reorderActive}
        reorderNumber={reorderNumber}
        editPreview={editPreview}
        cover={id === 0}
        isPremium={isPremium}
        locked={locked}
        handleToggleMediaLocked={() => handleToggleMediaLocked(id)}
      />
    )
  } else {
    if (image) {
      return (
        <UploadedFile
          type='image'
          fileBlob={imagePreview}
          removeFile={() => removeFile(image)}
          toggleEdit={() => {
            if (!reorderActive) {
              toggleImageEdit(image, id)
            } else {
              updateOrder()
            }
          }}
          customClass={` ${reorderActive ? 'newpost__reorder__file' : ''} `}
          hasReorderCircle={reorderActive}
          reorderNumber={reorderNumber}
          editPreview={editPreview}
          cover={id === 0}
          isPremium={isPremium}
          locked={locked}
          handleToggleMediaLocked={() => handleToggleMediaLocked(id)}
        />
      )
    } else {
      return null
    }
  }
}

export default PostImage
