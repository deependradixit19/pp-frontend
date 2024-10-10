import { FC, useState, useRef, ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { IconCameraOutline, IconCameraPortraitOutline } from '../../../../assets/svg/sprite'
import { useModalContext } from '../../../../context/modalContext'
import { attachPhoto, PhotoAttachmentResponse } from '../../../../services/endpoints/attachments'
import WhiteButton from '../../../Common/WhiteButton/WhiteButton'
import Button from '../../Buttons/Button'
import ScheduleBubble from '../ScheduleContent/Components/ScheduleBubble'

// Styling
import styles from './NewStream.module.scss'

interface ISteamData {
  schedule_date: Date | null
  teaser_image: string
  message: string
}

const NewStream: FC<{ date: Date }> = ({ date }) => {
  const [streamData, setStreamData] = useState<ISteamData>({
    schedule_date: date,
    teaser_image: '',
    message: ''
  })

  const { t } = useTranslation()
  const modalData = useModalContext()

  const onUploadImage = async (data: PhotoAttachmentResponse) => {
    if (data.path && data.path) {
      setStreamData(prevValue => ({
        ...prevValue,
        teaser_image: data.path
      }))
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.bubblesContainer}>
        <ScheduleBubble date={date} display='date' title='Date' />
        <ScheduleBubble date={date} display='time' title='Time' />
      </div>
      <UploadImage onUploadFinish={onUploadImage} />
      <textarea
        className={styles.streamInfo}
        placeholder='Stream info (Optional)'
        rows={5}
        value={streamData.message}
        onChange={e =>
          setStreamData(prevValue => ({
            ...prevValue,
            message: e.target.value
          }))
        }
      />
      <div className={styles.buttonsContainer}>
        <WhiteButton text={t('cancel')} customClass='tip-modal-cancel-button' clickFn={() => modalData.clearModal()} />
        <Button
          color='black'
          text={`Schedule`}
          customClass={`button button--black button--mont-14-normal button--width-13 button--height-3 sortModal--btn`}
        />
      </div>
    </div>
  )
}

export const UploadImage: FC<{
  onUploadFinish: (data: PhotoAttachmentResponse) => any
}> = ({ onUploadFinish }) => {
  const [isUploaded, setisUploaded] = useState<boolean>(false)
  const [photoData, setPhotoData] = useState<PhotoAttachmentResponse>({
    cropped_orientation: null,
    cropped_path: null,
    original_orientation: 'Landscape',
    path: '',
    storage_path: '',
    watermark_path: '',
    watermark_storage_path: ''
  })
  const inputFile = useRef<any>()

  const showFileUpload = () => {
    if (inputFile.current) {
      inputFile.current.click()
    }
  }

  const onFileInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const uploadImage = async (file: File | null) => {
      if (file && file.type.includes('image')) {
        const data = new FormData()
        data.append('photo', file)
        const photoData = await attachPhoto(data)
        return photoData
      }
    }
    // const target = event.target as HTMLInputElement;
    const file = event.target.files && event.target.files ? event.target.files[0] : null
    const data = await uploadImage(file)
    if (data && data.data) {
      setPhotoData(data.data)
      onUploadFinish(data.data)
      setisUploaded(true)
    }
  }
  return (
    <div
      className={styles.uploadBackground}
      style={{
        background:
          photoData.path.length > 0
            ? `url("${photoData.path}") center center / cover`
            : 'linear-gradient(140.46deg, rgba(#93CEFF, 0.1) 14.38%, rgba(#2894FF, 0.1) 94.98%)'
      }}
    >
      {Boolean(!isUploaded || photoData.path.length === 0) && (
        <div className={styles.content}>
          <div className={styles.uploadButton} onClick={showFileUpload}>
            <input
              ref={inputFile}
              type='file'
              name='teaserImage'
              id='teaserImage'
              onChange={e => onFileInputChange(e)}
            />
            <div className={styles.iconContainer}>+</div>
          </div>
          <p className={styles.infoMessage}>Add A Teaser Image</p>
        </div>
      )}
      {Boolean(isUploaded && photoData.path.length > 0) && (
        <div className={styles.imageIcon}>
          <IconCameraPortraitOutline color='#FFFFFF' />
        </div>
      )}
    </div>
  )
}

export default NewStream
