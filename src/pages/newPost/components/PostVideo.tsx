import { FC } from 'react'
import ProcessingError from '../../../features/ProcessingError/ProcessingError'
import ProcessingFile from '../../../features/ProcessingFile/ProcessingFile'
// import { useModalContext } from "../../../context/modalContext";
// import EditVideoModal from "../../../components/UI/Modal/EditVideoModal";
import UploadedFile from '../../../features/UploadedFile/UploadedFile'
import { IMediaItem, IProgressInfo } from '../../../types/interfaces/ITypes'

const PostVideo: FC<{
  isEdit: boolean
  editVideo?: IMediaItem
  video?: File
  id: number
  processing: boolean
  percentage: any
  uploadError: string
  previewUrl: string
  locked: boolean
  isPremium: boolean
  abortUploadCb: () => void
  removeFile: () => void
  removeByUrl?: (url: string) => void
  reorderActive?: boolean
  reorderNumber?: number
  updateOrder?: any
  editPreview: () => void
  imagePreview?: string
  trimmedVideo?: { start: number; end: number }
  previewOn?: boolean
  handleToggleMediaLocked: (idx: number) => void
  handleTogglePreviewOn: (idx: number) => void
}> = ({
  isEdit,
  editVideo,
  video,
  id,
  processing,
  percentage,
  uploadError,
  previewUrl,
  locked,
  isPremium,
  abortUploadCb,
  removeFile,
  removeByUrl,
  reorderActive,
  reorderNumber,
  updateOrder,
  editPreview,
  imagePreview,
  trimmedVideo,
  previewOn,
  handleToggleMediaLocked,
  handleTogglePreviewOn
}) => {
  // const modalData = useModalContext();

  // const toggleEdit = () => {
  //   modalData.addModal(
  //     "Edit video (coming soon)",
  //     <EditVideoModal vidSrc={videoPreview} />
  //   );
  // };

  if (uploadError) {
    return <ProcessingError uploadError={uploadError} onClose={removeFile} />
  }
  if (processing) {
    return (
      <ProcessingFile
        percentage={percentage}
        onAbort={() => {
          abortUploadCb()
          removeFile()
        }}
        className='processingFile__video'
      />
    )
  }

  if (isEdit && previewUrl) {
    return (
      <UploadedFile
        type='video'
        fileBlob={previewUrl}
        removeFile={() => removeByUrl && removeByUrl(previewUrl)}
        // removeFile={() => removeFile(video)}
        toggleEdit={() => {
          if (!reorderActive) {
            //   toggleEdit();
          } else {
            updateOrder()
          }
        }}
        disablePlay={reorderActive}
        customClass={`${reorderActive ? 'newpost__reorder__file' : ''}`}
        hasReorderCircle={reorderActive}
        reorderNumber={reorderNumber}
        editPreview={editPreview}
        imagePreview={imagePreview}
        trimmedVideo={trimmedVideo}
        cover={id === 0}
        isPremium={isPremium}
        locked={locked}
        handleToggleMediaLocked={() => handleToggleMediaLocked(id)}
        handleTogglePreviewOn={() => handleTogglePreviewOn(id)}
        previewOn={previewOn}
      />
    )
  } else {
    if (video) {
      return (
        <UploadedFile
          type='video'
          fileBlob={previewUrl}
          removeFile={removeFile}
          toggleEdit={() => {
            if (!reorderActive) {
              //   toggleEdit();
            } else {
              updateOrder()
            }
          }}
          disablePlay={reorderActive}
          customClass={`${reorderActive ? 'newpost__reorder__file' : ''}`}
          hasReorderCircle={reorderActive}
          reorderNumber={reorderNumber}
          editPreview={editPreview}
          imagePreview={imagePreview}
          trimmedVideo={trimmedVideo}
          cover={id === 0}
          isPremium={isPremium}
          locked={locked}
          handleToggleMediaLocked={() => handleToggleMediaLocked(id)}
          handleTogglePreviewOn={() => handleTogglePreviewOn(id)}
          previewOn={previewOn}
        />
      )
    } else {
      return null
    }
  }
}

export default PostVideo
