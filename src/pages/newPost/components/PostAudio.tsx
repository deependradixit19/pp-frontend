import { FC } from 'react'
import ProcessingError from '../../../features/ProcessingError/ProcessingError'
import ProcessingFile from '../../../features/ProcessingFile/ProcessingFile'
import UploadedFile from '../../../features/UploadedFile/UploadedFile'
import { IMediaItem } from '../../../types/interfaces/ITypes'

const PostAudio: FC<{
  isEdit: boolean
  editAudio?: IMediaItem
  id: any
  processing: boolean
  percentage: any
  uploadError: string
  abortUploadCb: () => void
  removeFile: (file: File) => void
  audio?: any
  audioPreview: any
  removeAudio: any
  removePreviewAudio?: (id: number) => void
  handleToggleMediaLocked: (idx: number) => void
}> = ({
  id,
  audio,
  processing,
  percentage,
  uploadError,
  abortUploadCb,
  removeFile,
  audioPreview,
  removeAudio,
  isEdit,
  editAudio,
  removePreviewAudio,
  handleToggleMediaLocked
}) => {
  if (processing) {
    return (
      <ProcessingFile
        percentage={percentage}
        onAbort={() => {
          abortUploadCb()
          audio && removeFile(audio)
        }}
      />
    )
  }
  if (uploadError) {
    return <ProcessingError uploadError={uploadError} onClose={() => audio && removeFile(audio)} />
  }
  if (isEdit && editAudio?.url) {
    return (
      <UploadedFile
        type='audio'
        fileBlob={audioPreview}
        removeFile={() => {
          removePreviewAudio && removePreviewAudio(editAudio.id)
        }}
        handleToggleMediaLocked={() => handleToggleMediaLocked(id)}
      />
    )
  } else {
    if (audio) {
      return (
        <UploadedFile
          type='audio'
          fileBlob={audioPreview}
          removeFile={() => removeFile(audio)}
          handleToggleMediaLocked={() => handleToggleMediaLocked(id)}
          // removeFile={() => removeAudio(audio, id)}
        />
      )
    } else {
      return null
    }
  }
}

export default PostAudio
