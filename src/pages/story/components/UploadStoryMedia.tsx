import { useCallback, useRef, VFC } from 'react'

// Services
import { Orientation, validateMedia } from '../../../helpers/media'
import {
  attachPhoto,
  attachVideo,
  attachVideoStory,
  VideoAttachmentResponseStory
} from '../../../services/endpoints/attachments'
//Components
import SvgIconButton from '../../../components/UI/Buttons/SvgIconButton'
import * as SvgIcons from '../../../assets/svg/sprite'
// Styling
import styles from '../NewStory.module.scss'
import { useTranslation } from 'react-i18next'

type UploadStoryMediaProps = {
  setImageData: (path: string, orientation: Orientation) => void
  setVideosData: (
    videos: {
      path: string
      orientation: Orientation
    }[]
  ) => void
  setProgressInfo: (percentage: number, cancelCb: () => void, error?: string) => void
}

const UploadStoryMedia: VFC<UploadStoryMediaProps> = ({ setImageData, setVideosData, setProgressInfo }) => {
  const fileRef = useRef<HTMLInputElement>(null)

  const { t } = useTranslation()

  const handleImageUploadClick = useCallback(() => {
    // TODO: Remove current file if user clicks again and chooses another file
    fileRef.current?.click()
  }, [])

  const uploadFile = useCallback(
    async (file: File) => {
      if (file.type.startsWith('image/')) {
        await validateMedia(file, t)
        const data = new FormData()
        data.append('photo', file)
        const res = await attachPhoto(data, (loaded: number, total: number, cancelCb: () => void) => {
          const percentage = Math.round((100 * loaded) / total)

          setProgressInfo(percentage, cancelCb)
        })
        if (res.data.path) {
          const { path, original_orientation } = res.data
          setImageData(path, original_orientation)
        }
        return res
      }
      if (file.type.startsWith('video/')) {
        await validateMedia(file, t)
        const data = new FormData()
        data.append('video', file)
        data.append('type', 'story')
        const res = await attachVideoStory(data, (loaded: number, total: number, cancelCb: () => void) => {
          const percentage = Math.round((100 * loaded) / total)

          setProgressInfo(percentage, cancelCb)
        })
        if (res.data.length) {
          const videoArray: VideoAttachmentResponseStory = res.data
          const videos: { path: string; orientation: Orientation }[] = videoArray.map(video => {
            return {
              path: video.s3_path,
              orientation: video.orientation
            }
          })
          setVideosData(videos)
        }
        return res
      }
    },
    [setImageData, setVideosData, setProgressInfo]
  )

  const handleSetUpload = useCallback(
    async (event: React.FormEvent<HTMLInputElement>) => {
      const tmpFiles = (event.target as HTMLInputElement).files

      if (!tmpFiles || !tmpFiles.length) {
        return
      }

      const file = tmpFiles[0]
      await uploadFile(file)
    },
    [uploadFile]
  )

  return (
    <>
      <SvgIconButton
        icon={<SvgIcons.IconImageOutline color='white' />}
        type='black--transparent'
        customClass={styles.footerButton}
        clickFn={handleImageUploadClick}
      />
      <input
        ref={fileRef}
        type='file'
        onChange={handleSetUpload}
        multiple={true}
        id='post__anything__upload'
        accept='image/*,video/mp4,video/x-m4v,video/*'
        hidden={true}
      />
    </>
  )
}
export default UploadStoryMedia
