import { FC, useState, useRef, useCallback } from 'react'
import './_profileImageModal.scss'
import { useQueryClient } from 'react-query'
import { Cropper } from 'react-cropper'
import Webcam from 'react-webcam'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useModalContext } from '../../../../context/modalContext'
import { putAvatarImage, putCoverImage } from '../../../../services/endpoints/profile'
import { attachPhoto } from '../../../../services/endpoints/attachments'

import { addToast } from '../../../Common/Toast/Toast'
import { Icons } from '../../../../helpers/icons'
import ImgInCircle from '../../ImgInCircle/ImgInCircle'
import 'cropperjs/dist/cropper.css'

const ProfileImageModal: FC<{
  isCover?: boolean
  closeNestedModal?: () => void
}> = ({ isCover = false, closeNestedModal }) => {
  const [crop, setCrop] = useState<boolean>(false)
  const [cameraActive, setCameraActive] = useState<boolean>(false)
  const [cameraSelfie, setCameraSelfie] = useState<boolean>(true)
  const [cropActive, setCropActive] = useState<boolean>(false)
  const [avatar, setAvatar] = useState<{ img: string | File; blob: string }>({
    img: '',
    blob: ''
  })
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const modalData = useModalContext()
  const uploadRef = useRef<HTMLInputElement>(null)
  const webcamRef = useRef<any>(null)
  const cropperRef = useRef<HTMLImageElement>(null)
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const changePage = () => {
    setCrop(!crop)
    setCameraActive(false)
  }

  const updateFile = (e: React.FormEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files?.[0]?.['type'] !== 'image/jpeg') {
      addToast('error', t('filesMustBeOfFormat'))
      return
    }
    let imgsrc = URL.createObjectURL(files![0])
    setAvatar({ img: files![0], blob: imgsrc })
    changePage()
  }

  const updateAvatarImages = (avatar: string, cropped_avatar?: string) => {
    let uploadPromise
    if (!isCover) {
      const newImages = { avatar, cropped_avatar }
      uploadPromise = putAvatarImage(newImages)
      uploadPromise
        .then(() => {
          queryClient.invalidateQueries('profile')
          queryClient.invalidateQueries('loggedProfile')
          closeNestedModal ? closeNestedModal() : modalData.clearModal()
          setIsUploading(false)
          addToast('success', t('avatarUpdatedSuccessfully'), undefined, true)
        })
        .catch(err => {
          setIsUploading(false)
          addToast('error', t('error:errorSomethingWentWrong'), undefined, true)
          console.error(err)
        })
    } else {
      const newImages = { cover: avatar, cropped_cover: cropped_avatar }
      uploadPromise = putCoverImage(newImages)
      uploadPromise
        .then(() => {
          queryClient.invalidateQueries('profile')
          queryClient.invalidateQueries('loggedProfile')
          closeNestedModal ? closeNestedModal() : modalData.clearModal()
          setIsUploading(false)
          addToast('success', t('coverUpdatedSuccessfully'), undefined, true)
        })
        .catch(err => {
          setIsUploading(false)
          addToast('error', t('error:errorSomethingWentWrong'), undefined, true)
          console.error(err)
        })
    }
  }

  const uploadFile = async () => {
    setIsUploading(true)
    addToast('loading', t('uploadingFilePleaseWait'))
    const data = new FormData()

    if (cropActive) {
      const imageElement: any = cropperRef?.current
      const cropper: any = imageElement?.cropper
      ;(cropper.getCroppedCanvas() as HTMLCanvasElement).toBlob(blob => {
        const file = blob
        if (file) {
          data.append('cropped_photo', file)
          data.append('photo', avatar.img)
          attachPhoto(data)
            .then(resp => {
              // updateAvatarImages(resp.data?.path, resp.data?.cropped_path)
              updateAvatarImages(resp.data?.path ?? undefined, resp.data?.cropped_path ?? undefined)
            })
            .catch(err => {
              setIsUploading(false)
              addToast('error', t('error:errorSomethingWentWrong'), undefined, true)
              console.error(err)
            })
        } else {
          setIsUploading(false)
          toast.dismiss()
          throw new Error(t('error:errorFailedGettingCroppedBlob'))
        }
      }, 'image/jpeg')
    } else {
      data.append('photo', avatar.img)
      attachPhoto(data)
        .then(resp => {
          updateAvatarImages(resp.data?.path)
        })
        .catch(err => {
          setIsUploading(false)
          addToast('error', t('error:errorSomethingWentWrong'), undefined, true)
          console.error(err)
        })
    }
  }

  const capture = useCallback(async () => {
    const imgSrc = webcamRef.current.getScreenshot()
    let file = await fetch(imgSrc)
      .then(r => r.blob())
      .then(blobFile => new File([blobFile], 'photo', { type: 'image/jpeg' }))
    setAvatar({ ...avatar, img: file, blob: imgSrc })
    changePage()
    //eslint-disable-next-line
  }, [webcamRef])

  return (
    <div className={`profileImageModal ${isUploading ? 'profileImageModal__disabled' : ''}`}>
      {!crop && (
        <>
          <input
            ref={uploadRef}
            type='file'
            onChange={updateFile}
            id='profile__avatar'
            accept='image/jpeg'
            hidden={true}
          />
          <div className='profileImageModal__block' onClick={() => uploadRef.current!.click()}>
            <div className='profileImageModal__img'>
              <img src={Icons.img} alt={t('uploadPic')} />
            </div>
            <p className='profileImageModal__text'>{t('uploadNewPhoto')}</p>
          </div>
          {cameraActive ? (
            <div className='profileImageModal__camera'>
              <Webcam
                className='profileImageModal__camera__cam'
                ref={webcamRef}
                screenshotFormat='image/jpeg'
                videoConstraints={{
                  facingMode: cameraSelfie ? 'user' : { exact: 'environment' }
                }}
              />
              <div className='profileImageModal__camera__capture' onClick={capture} />
              <div className='profileImageModal__camera__rotate' onClick={() => setCameraSelfie(!cameraSelfie)}>
                <img src={Icons.rotate} alt={t('rotate')} />
              </div>
              <div className='profileImageModal__camera__close' onClick={() => setCameraActive(!cameraActive)}>
                <img src={Icons.close} alt={t('closeModal')} />
              </div>
            </div>
          ) : (
            ''
          )}
          <div className='profileImageModal__block' onClick={() => setCameraActive(!cameraActive)}>
            <div className='profileImageModal__img'>
              <img src={Icons.cameraBlack} alt={t('takePhoto')} />
            </div>
            <p className='profileImageModal__text'>{t('takePhoto')}</p>
          </div>
        </>
      )}
      {crop && (
        <>
          <div className={`profileImageModal__crop${!isCover ? ' profileImageModal__crop__isProfile' : ''}`}>
            <div className='profileImageModal__crop__block'>
              {!cropActive ? (
                <img src={avatar.blob} alt={t('avatar')} className='profileImageModal__crop__block--img' />
              ) : (
                <Cropper
                  src={avatar.blob}
                  style={{ maxHeight: '100%', maxWidth: '100%' }}
                  viewMode={1}
                  dragMode='move'
                  aspectRatio={!isCover ? 1 : 0}
                  ref={cropperRef}
                />
              )}
            </div>
            <div className='profileImageModal__crop__actions'>
              <ImgInCircle type='modal' customClass='profileImageModal__crop__action' clickFn={changePage}>
                <img src={Icons.back} alt={t('return')} />
              </ImgInCircle>
              <ImgInCircle
                type='modal'
                customClass='profileImageModal__crop__action'
                clickFn={() => setCropActive(!cropActive)}
              >
                <img src={Icons.cropimg} alt={t('cropPic')} />
              </ImgInCircle>
              <ImgInCircle
                type='modal'
                customClass={`profileImageModal__crop__action ${
                  !isCover ? 'profileImageModal__crop__action__rotate' : ''
                }`}
              >
                <img src={Icons.reload} alt={t('reload')} />
              </ImgInCircle>
              <ImgInCircle type='modal' customClass='profileImageModal__crop__action' clickFn={uploadFile}>
                <img src={Icons.checkmark} alt={t('accept')} />
              </ImgInCircle>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ProfileImageModal
