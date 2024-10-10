import { FC, useEffect, useRef, useState, ChangeEvent, useCallback, RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { Swiper, SwiperSlide } from 'swiper/react'
import { produce } from 'immer'
import { iNewMessage } from '../../../types/iTypes'
import SetPrice from './components/SetPrice'
import WriteMessage from './components/WriteMessage'
import Button from '../../../components/UI/Buttons/Button'
import { validateMediaFiles } from '../../../helpers/media'
import { attachPhoto, attachVideo, attachAudio } from '../../../services/endpoints/attachments'
import { IProgressInfo } from '../../../types/interfaces/ITypes'
import { addToast } from '../../../components/Common/Toast/Toast'
import PostImage from '../../../pages/newPost/components/PostImage'
import { useUserContext } from '../../../context/userContext'
import PostVideo from '../../../pages/newPost/components/PostVideo'
import AddAnything from '../../../pages/newPost/components/AddAnything'
import EditPreviewModal from '../../../components/UI/Modal/EditPreviewModal/EditPreviewModal'
import { useModalContext } from '../../../context/modalContext'
import PhotoEditView from '../../PhotoEdit/PhotoEditView'
import GifPopup from '../../GifPopup/GifPopup'
import { IconClose, IconCloseLarge, IconQuotes } from '../../../assets/svg/sprite'
import './_directMessage.scss'
import AudioMessage from '../../../components/UI/AudioMessage/AudioMessage'
import messageStyles from '../Message/_message.module.scss'

const CreateMessage: FC<{
  sendMessage: any
  customClass?: string
  disabled?: boolean
  writeMessageCustomClass?: string
  onGifClick?: (val: any) => void
  reply?: { body: any; id: string | number; message: any; recieved?: boolean }
  setReply?: (
    val: {
      body: string
      id: string | number
      message: any
      recieved?: boolean
    } | null
  ) => void
  forceHideAttachments?: boolean
  participants?: any
  sending?: boolean
  hasGif?: boolean
  onFocusIn?: (val: string) => void
  onFocusOut?: (val: string) => void
  onMessageChange?: (val: any) => void
  setGifOpenInfo?: (val: boolean) => void
  inboxRef?: RefObject<HTMLDivElement>
}> = ({
  sendMessage,
  customClass,
  writeMessageCustomClass,
  reply,
  forceHideAttachments,
  sending,
  onGifClick,
  hasGif = false,
  setGifOpenInfo,
  onFocusIn,
  onFocusOut,
  onMessageChange,
  setReply,
  inboxRef,
  disabled
}) => {
  const { t } = useTranslation()

  const progressInfosRef = useRef<any>(null)
  const [messageReady, setMessageReady] = useState(true)
  const [gifOpen, setGifOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<any>([])
  const [priceModalActive, setPriceModalActive] = useState(false)
  const [attachmentsMinimized, setAttachmentsMinimized] = useState(false)
  const [schedule, setSchedule] = useState('')
  const [progressInfos, setProgressInfos] = useState<{ val: IProgressInfo[] }>({
    val: []
  })

  const replyRef = useRef<HTMLDivElement>(null)
  const attachmentsRef = useRef<HTMLDivElement>(null)

  const [message, setMessage] = useState<iNewMessage>({
    text: '',
    audioMessage: null,
    audioPreview: null,
    price: 0,
    media: [],
    previewMedia: [],
    vaultImages: []
  })

  const [editPreviewModalOpen, setEditPreviewModalOpen] = useState(false)
  const [videoPreviewData, setVideoPreviewData] = useState<{
    defaultPreview: string
    storageSrc: string
    orientation?: string
    thumbnails?: string[]
    thumbnailIndex?: number
    trimPreview?: {
      start: number
      end: number
    }
  } | null>(null)

  const userData = useUserContext()
  const modalContext = useModalContext()

  const selectFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    // postReady && setPostReady(false);
    const tmpFiles = event.target.files

    if (!tmpFiles || !tmpFiles.length) {
      return
    }

    // const files = Array.from(tmpFiles);
    const files = await validateMediaFiles(Array.from(tmpFiles), t)
    const audioFiles = files.filter((file: File) => file.type.includes('audio/'))
    const prevAudioFiles = progressInfos.val.filter(info => info.type === 'sound' || info.type === 'audio')
    const videoPhotoFiles = files.filter((file: File) => {
      return file.type.includes('video/') || file.type.includes('image/')
    })
    const tmpVideoPhotoFiles = videoPhotoFiles.filter((file: File) => {
      const res = !selectedFiles.some((el: File) => {
        return el.size === file.size
      })

      !res && addToast('error', t('error:cannotUploadDuplicateFile'))
      return res
    })

    if (audioFiles?.length > 1 || (audioFiles?.length >= 1 && prevAudioFiles.length === 1)) {
      addToast('error', t('youCanUploadOnlyOneAudioFilePerPost'))
    }

    if (files.length + progressInfos.val.length > 40) {
      addToast('error', t('maximumNumberOfMediaFilesExceeded'))
      return
    }
    if (!!audioFiles.length) {
      if (prevAudioFiles.length === 1) {
        uploadFiles(tmpVideoPhotoFiles)
        setSelectedFiles([...selectedFiles, ...tmpVideoPhotoFiles])
      } else {
        uploadFiles([...tmpVideoPhotoFiles, audioFiles[0]])
        setSelectedFiles([...selectedFiles, ...tmpVideoPhotoFiles])
      }
    } else {
      uploadFiles(tmpVideoPhotoFiles)
      setSelectedFiles([...selectedFiles, ...tmpVideoPhotoFiles])
    }
  }

  const removeFile = (index: number) => {
    const tmpProgressInfos = progressInfos.val.filter((info: any) => progressInfos.val.indexOf(info) !== index)
    const tmpSelectedFiles = selectedFiles.filter((file: any) => selectedFiles.indexOf(file) !== index)

    if (!tmpProgressInfos.length) {
      messageReady && setMessageReady(false)
    }
    setProgressInfos({ val: [...tmpProgressInfos] })
    progressInfosRef.current = { val: tmpProgressInfos }
    setSelectedFiles(tmpSelectedFiles)
  }

  const removeByUrl = (url: string) => {
    const tmpProgressInfos = progressInfos.val.filter((info: any) => info.fileName !== url)
    setProgressInfos({ val: [...tmpProgressInfos] })
  }

  const handleToggleMediaLocked = (idx: number) => {
    const tmpArr = progressInfos.val.map((info, index) => {
      if (index === idx) {
        return {
          ...info,
          locked: !info.locked
        }
      } else {
        return info
      }
    })
    setProgressInfos({ val: tmpArr })
  }

  const handleTogglePreviewOn = (idx: number) => {
    const tmpArr = progressInfos.val.map((info, index) => {
      if (index === idx) {
        return {
          ...info,
          previewOn: !info.previewOn
        }
      } else {
        return info
      }
    })
    setProgressInfos({ val: tmpArr })
  }

  const getPreviewStatus = (status: string) => {
    if (status === 'no-preview') {
      return false
    }
    return true
  }

  const handleEditVideoPreview = (
    defaultPreview: string,
    storageSrc: string,
    orientation?: string,
    thumbnails?: string[],
    imagePreview?: string,
    trimPreview?: {
      start: number
      end: number
    }
  ) => {
    let indx = undefined
    if (imagePreview) {
      indx = thumbnails?.indexOf(imagePreview)
    }
    setVideoPreviewData({
      defaultPreview,
      storageSrc,
      orientation,
      thumbnails,
      trimPreview,
      thumbnailIndex: indx != null && indx >= 0 ? indx : undefined
    })
    !editPreviewModalOpen && setEditPreviewModalOpen(true)
  }

  const handleUpdatePreview = (previewData: {
    imagePrev?: { previewUrl: string; defaultPrev: string }
    videoPrev?: { start: number; end: number; defaultPrev: string }
  }) => {
    const defaultPrev = previewData.imagePrev?.defaultPrev ?? previewData.videoPrev?.defaultPrev
    const progressInfoChangeId = progressInfos.val.findIndex(info => info.previewUrl === defaultPrev)
    if (previewData.imagePrev) {
      setProgressInfos(
        produce(progressInfos, draft => {
          draft.val[progressInfoChangeId].imagePreview = previewData.imagePrev?.previewUrl
          delete draft.val[progressInfoChangeId].trimPreview
        })
      )
    }
    if (previewData.videoPrev) {
      setProgressInfos(
        produce(progressInfos, draft => {
          draft.val[progressInfoChangeId].trimPreview = {
            start: previewData.videoPrev?.start ?? 0,
            end: previewData.videoPrev?.end ?? 10
          }
          delete draft.val[progressInfoChangeId].imagePreview
        })
      )
    }
    editPreviewModalOpen && setEditPreviewModalOpen(false)
  }

  useEffect(() => {
    if (localStorage.getItem('share-message')) {
      const sharedPostArray = localStorage.getItem('share-message')
      const parsedArray = sharedPostArray && JSON.parse(sharedPostArray)

      const _progressInfos = progressInfosRef.current ? [...progressInfosRef?.current?.val] : []
      for (let i = 0; i < parsedArray.length; i++) {
        if (parsedArray[i].post) {
          if (parsedArray[i].post.photos) {
            const photos = parsedArray[i].post.photos
            photos.forEach((photo: any, index: number) => {
              _progressInfos.push({
                id: photo.id,
                cancel: () => {},
                error: '',
                fileName: `shared-photo-${photo.id}`,
                locked: false,
                orientation: photo.orientation,
                percentage: 100,
                previewUrl: photo.url,
                storageUrl: photo.url,
                type: 'photo',
                text: photo.text
              })
            })
          }
          if (parsedArray[i].post.videos.length > 0) {
            const videos = parsedArray[i].post.videos
            videos.forEach((video: any, index: number) => {
              _progressInfos.push({
                id: video.id,
                cancel: () => {},
                error: '',
                fileName: `shared-video-${video.id}`,
                locked: false,
                orientation: video.orientation,
                percentage: 100,
                previewUrl: video.url,
                storageUrl: video.url,
                type: 'video',
                previewOn: false,
                thumbnails: video.thumbnails || []
              })
            })
          }
        }
        if (parsedArray[i].story) {
          const story = parsedArray[i].story
          if (story.image_src) {
            _progressInfos.push({
              id: story.id,
              cancel: () => {},
              error: '',
              fileName: `shared-story-photo-${story.id}`,
              locked: false,
              orientation: story.image_orientation,
              percentage: 100,
              previewUrl: story.image_src,
              storageUrl: story.image_src,
              type: 'photo',
              text: story.text
            })
          }
          if (story.video_src) {
            _progressInfos.push({
              id: story.id,
              cancel: () => {},
              error: '',
              fileName: `shared-story-video-${story.id}`,
              locked: false,
              orientation: story.video_orientation,
              percentage: 100,
              previewUrl: story.video_src,
              storageUrl: story.video_src,
              type: 'video',
              thumbnails: story.thumbnails || [],
              previewOn: false
            })
          }
        }
        if (parsedArray[i].message) {
          if (parsedArray[i].message.photos) {
            const photos = parsedArray[i].message.photos
            photos.forEach((photo: any, index: number) => {
              _progressInfos.push({
                id: photo.id,
                cancel: () => {},
                error: '',
                fileName: `shared-photo-${photo.id}`,
                locked: false,
                orientation: photo.orientation,
                percentage: 100,
                previewUrl: photo.url,
                storageUrl: photo.url,
                type: 'photo',
                text: photo.text
              })
            })
          }
          if (parsedArray[i].message.videos.length > 0) {
            const videos = parsedArray[i].message.videos
            videos.forEach((video: any, index: number) => {
              _progressInfos.push({
                id: video.id,
                cancel: () => {},
                error: '',
                fileName: `shared-video-${video.id}`,
                locked: false,
                orientation: video.orientation,
                percentage: 100,
                previewUrl: video.url,
                storageUrl: video.url,
                type: 'video',
                previewOn: false,
                thumbnails: video.thumbnails || []
              })
            })
          }
        }
      }

      setSelectedFiles([..._progressInfos])

      setProgressInfos({ val: _progressInfos })
      progressInfosRef.current = {
        val: _progressInfos
      }

      setMessageReady(true)

      localStorage.removeItem('share-message')
    }
  }, [])

  useEffect(() => {
    if (replyRef.current && attachmentsRef.current) {
      if (reply) {
        const height = replyRef.current.getBoundingClientRect().height
        const padding = parseFloat(
          window.getComputedStyle(replyRef.current).getPropertyValue('padding-bottom').replace('px', '')
        )

        const bottom = height - padding + 20
        attachmentsRef.current.setAttribute('style', `bottom: ${bottom}px;`)
      } else {
        attachmentsRef.current.removeAttribute('style')
      }
    }
  }, [reply])

  useEffect(() => {
    if (inboxRef?.current && replyRef.current && attachmentsRef.current) {
      const attachmentsOpen = selectedFiles.filter((item: File) => !item.type.includes('audio')).length > 0
      const filesHeight = attachmentsRef.current.getBoundingClientRect().height

      const replyPadding = parseFloat(
        window.getComputedStyle(replyRef.current).getPropertyValue('padding-bottom').replace('px', '')
      )
      const replyHeight = replyRef.current.getBoundingClientRect().height
      const replyTotal = replyHeight - replyPadding
      const parentPadding = parseFloat(
        window
          .getComputedStyle(replyRef.current.parentElement ? replyRef.current.parentElement : replyRef.current)
          .getPropertyValue('padding-bottom')
          .replace('px', '')
      )
      const filesTotal = filesHeight + replyTotal + 20
      if (attachmentsOpen && reply) {
        inboxRef.current.setAttribute('style', `padding-bottom: ${filesTotal + replyTotal - parentPadding - 40}px`)
      } else if (attachmentsOpen) {
        inboxRef.current.setAttribute('style', `padding-bottom: ${filesHeight - parentPadding - 20}px`)
      } else if (reply) {
        inboxRef.current.setAttribute(
          'style',
          `padding-bottom: ${
            replyHeight > parentPadding ? replyHeight - parentPadding - 20 : parentPadding - replyHeight - 20
          }px`
        )
      } else {
        inboxRef.current.removeAttribute('style')
      }
    }
  }, [reply, selectedFiles])

  const upload = useCallback(
    async (file: File) => {
      let _progressInfos = [...progressInfosRef?.current?.val]
      const data = new FormData()
      if (file.type.includes('image')) {
        try {
          data.append('photo', file)
          const res = await attachPhoto(data, (loaded: number, total: number, cancelCb: () => void) => {
            const perc = Math.round((100 * loaded) / total)
            _progressInfos = [...progressInfosRef?.current?.val]

            const index = _progressInfos.findIndex(item => item.fileName === file.name)

            _progressInfos[index].percentage = perc
            _progressInfos[index].cancel = cancelCb
            _progressInfos[index].error = ''
            _progressInfos[index].type = 'photo'

            setProgressInfos({
              val: [...progressInfos.val, ..._progressInfos]
            })
          })
          if (res.data.path) {
            _progressInfos = [...progressInfosRef?.current?.val]
            const index = _progressInfos.findIndex(item => item.fileName === file.name)
            _progressInfos[index].previewUrl = res.data.path
            _progressInfos[index].storageUrl = res.data.storage_path
            _progressInfos[index].locked = !!message.price
            _progressInfos[index].orientation = res.data.original_orientation

            setProgressInfos({
              val: [...progressInfos.val, ..._progressInfos]
            })
          }
          return res
        } catch (err: any) {
          _progressInfos = [...progressInfosRef?.current?.val]
          const index = _progressInfos.findIndex(item => item.fileName === file.name)
          if (err.isAxiosError) {
            _progressInfos[index].error = t('errorUploadingFile')
            setProgressInfos({
              val: [...progressInfos.val, ..._progressInfos]
            })

            throw new Error(t('errorUploadingFile'))
          } else {
            // _progressInfos[idx].error = err.message;
            // if (err.type === 'size') {
            //   _progressInfos[idx].percentage = 0;
            // }

            // setProgressInfos({
            //   val: [...progressInfos.val, ..._progressInfos],
            // });
            // setProgressInfosNew({
            //   val: [...progressInfosNew.val, ..._progressInfos],
            // });
            // addToast('error', err.message);
            throw new Error(err.message)
          }
        }
      } else if (file.type.includes('video')) {
        try {
          data.append('video', file)
          const res = await attachVideo(data, (loaded: number, total: number, cancelCb: () => void) => {
            const perc = Math.round((100 * loaded) / total)
            _progressInfos = [...progressInfosRef?.current?.val]

            const index = _progressInfos.findIndex(item => item.fileName === file.name)
            _progressInfos[index].percentage = perc
            _progressInfos[index].cancel = cancelCb
            _progressInfos[index].error = ''
            _progressInfos[index].type = 'video'
            _progressInfos[index].previewOn = getPreviewStatus(userData.post_preview_type)

            setProgressInfos({
              val: [...progressInfos.val, ..._progressInfos]
            })
          })
          if (res.data.path) {
            _progressInfos = [...progressInfosRef?.current?.val]
            const index = _progressInfos.findIndex(item => item.fileName === file.name)
            _progressInfos[index].previewUrl = res.data.s3_path
            _progressInfos[index].storageUrl = res.data.path
            _progressInfos[index].orientation = res.data.orientation
            _progressInfos[index].thumbnails = res.data.thumbs
            _progressInfos[index].locked = !!message.price

            setProgressInfos({
              val: [...progressInfos.val, ..._progressInfos]
            })
          }
          return res
        } catch (err: any) {
          _progressInfos = [...progressInfosRef?.current?.val]
          const index = _progressInfos.findIndex(item => item.fileName === file.name)
          if (err.isAxiosError) {
            _progressInfos[index].error = t('errorUploadingFile')
            setProgressInfos({
              val: [...progressInfos.val, ..._progressInfos]
            })

            throw new Error(t('errorUploadingFile'))
          } else {
            // _progressInfos[idx].error = err.message;
            // if (err.type === 'size') {
            //   _progressInfos[idx].percentage = 0;
            // }

            // setProgressInfos({
            //   val: [...progressInfos.val, ..._progressInfos],
            // });
            // setProgressInfosNew({
            //   val: [...progressInfosNew.val, ..._progressInfos],
            // });
            // addToast('error', err.message);
            throw new Error(err.message)
          }
        }
      } else if (file.type.includes('audio')) {
        try {
          data.append('audio', file)
          const res = await attachAudio(data, (loaded: number, total: number, cancelCb: () => void) => {
            const perc = Math.round((100 * loaded) / total)
            _progressInfos = [...progressInfosRef?.current?.val]

            const index = _progressInfos.findIndex(item => item.fileName === file.name)

            _progressInfos[index].percentage = perc
            _progressInfos[index].cancel = cancelCb
            _progressInfos[index].error = ''
            _progressInfos[index].type = 'audio'
            setProgressInfos({
              val: [...progressInfos.val, ..._progressInfos]
            })
          })
          if (res.data.path) {
            _progressInfos = [...progressInfosRef?.current?.val]
            const index = _progressInfos.findIndex(item => item.fileName === file.name)
            _progressInfos[index].previewUrl = res.data.path
            _progressInfos[index].storageUrl = res.data.storage_path
            _progressInfos[index].locked = !!message.price
            setProgressInfos({
              val: [...progressInfos.val, ..._progressInfos]
            })
          }
          return res
        } catch (err: any) {
          _progressInfos = [...progressInfosRef?.current?.val]
          const index = _progressInfos.findIndex(item => item.fileName === file.name)
          if (err.isAxiosError) {
            _progressInfos[index].error = t('errorUploadingFile')
            setProgressInfos({
              val: [...progressInfos.val, ..._progressInfos]
            })

            throw new Error(t('errorUploadingFile'))
          } else {
            // _progressInfos[idx].error = err.message;
            // if (err.type === 'size') {
            //   _progressInfos[idx].percentage = 0;
            // }

            // setProgressInfos({
            //   val: [...progressInfos.val, ..._progressInfos],
            // });
            // setProgressInfosNew({
            //   val: [...progressInfosNew.val, ..._progressInfos],
            // });
            // addToast('error', err.message);
            throw new Error(err.message)
          }
        }
      }
    },
    [progressInfos]
  )
  const uploadFiles = (files: File[]) => {
    let _progressInfos = files.map(file => ({
      percentage: 0,
      fileName: file.name
    }))
    progressInfosRef.current = {
      val: _progressInfos
    }

    const uploadPromises = files.map(file => upload(file))

    Promise.all(uploadPromises)
      .then(resp => {
        setMessageReady(true)
      })
      .catch(err => {
        messageReady && setMessageReady(false)
      })
  }

  const prepareMessage = (progInfos: IProgressInfo[]) => {
    const findPaths = (term: string) =>
      progInfos.filter((item: IProgressInfo) => {
        if (item.previewUrl.includes(term)) {
          return item
        }
      })

    const finishedMessage = {
      message: message.text,
      replied_message: reply?.message ? { message: reply.message } : null,
      replied_id: reply?.id || null,
      schedule_date: schedule !== '' ? schedule : null,
      photos: findPaths('/public/images').map((item: IProgressInfo) => {
        return {
          path: item.previewUrl,
          order: progressInfos.val.indexOf(item) + 1,
          orientation: item.orientation,
          locked: item.locked,
          text: item.text,
          type: 'photo'
        }
      }),
      videos: findPaths('/public/videos').map((item: any) => {
        return {
          path: item.previewUrl,
          order: progressInfos.val.indexOf(item) + 1,
          orientation: item.orientation,
          locked: item.locked,
          active_thumbnail: item.imagePreview || null,
          video_clip: item.trimPreview ? { start: item.trimPreview.start, end: item.trimPreview.end } : null,
          thumbnails: item.thumbnails,
          preview: item.previewOn,
          type: 'video'
        }
      }),
      sounds: findPaths('/public/sound').map((item: any) => {
        return {
          path: item.previewUrl,
          order: progressInfos.val.indexOf(item) + 1,
          locked: item.locked,
          type: 'sound'
        }
      }),
      price: message.price
    }

    return finishedMessage
  }

  const renderAttachments = () => {
    return (
      <div
        ref={attachmentsRef}
        className={`directmessage__attachments ${
          selectedFiles.filter((item: File) => !item.type?.includes('audio')).length > 0
            ? 'directmessage__attachments--active'
            : ''
        } ${attachmentsMinimized ? 'directmessage__attachments--minimized' : ''} ${customClass ? customClass : ''} ${
          forceHideAttachments ? 'directmessage__attachments--inactive' : ''
        } ${message.vaultImages.length > 0 ? 'directmessage__attachments--vault' : ''}
          ${message?.audioMessage && message?.audioPreview ? 'directmessage__attachments--sound' : ''}
          `}
      >
        <div className='directmessage__attachments__header'>
          <h1 onClick={() => setAttachmentsMinimized(!attachmentsMinimized)}>
            {!priceModalActive ? 'Attached Files' : 'Set Price'}
          </h1>
          {userData.role !== 'fan' &&
            (!message.price ? (
              <Button
                text={!priceModalActive ? t('setPrice') : t('attachedFiles')}
                color='black'
                height='3'
                padding='2'
                font='mont-14-normal'
                width='fit'
                clickFn={() => {
                  setPriceModalActive(!priceModalActive)
                  setAttachmentsMinimized(false)
                }}
              />
            ) : (
              <div
                className='directmessage__attachments__pricebutton'
                onClick={() => {
                  setPriceModalActive(!priceModalActive)
                  setAttachmentsMinimized(false)
                }}
              >
                ${message.price}
              </div>
            ))}
        </div>
        {!priceModalActive ? (
          <Swiper className='mediaSwiper' spaceBetween={10} slidesPerView={'auto'}>
            {progressInfos.val.map((item: IProgressInfo, key: number) => {
              if (item.type === 'photo') {
                return (
                  <SwiperSlide key={key}>
                    <PostImage
                      isEdit={true}
                      id={key}
                      imagePreview={item.previewUrl}
                      processing={!item.previewUrl}
                      percentage={item.percentage}
                      abortUploadCb={item.cancel}
                      uploadError={item.error}
                      previewUrl={item.previewUrl}
                      locked={item.locked}
                      isPremium={!!message.price}
                      removeFile={() => removeFile(key)}
                      removeByUrl={() => removeFile(key)}
                      handleToggleMediaLocked={handleToggleMediaLocked}
                      editPreview={() => {
                        modalContext.addModal(
                          '',
                          <PhotoEditView
                            photo={{
                              url: item.previewUrl,
                              text: item.text
                            }}
                            handleClose={() => {
                              modalContext.clearModal()
                            }}
                            handleSetPhotoData={data => {
                              setProgressInfos(
                                produce(progressInfos, draft => {
                                  draft.val[key].text = data.text
                                })
                              )
                            }}
                          />,
                          true,
                          true,
                          'fullScreen no-close'
                        )
                      }}
                    />
                  </SwiperSlide>
                )
              } else if (item.type === 'video') {
                return (
                  <SwiperSlide key={key}>
                    <PostVideo
                      isEdit={true}
                      id={key}
                      processing={!item.previewUrl}
                      percentage={item.percentage}
                      abortUploadCb={item.cancel}
                      uploadError={item.error}
                      previewUrl={item.previewUrl}
                      imagePreview={item.imagePreview}
                      locked={item.locked}
                      isPremium={!!message.price}
                      removeFile={() => removeFile(key)}
                      removeByUrl={() => removeFile(key)}
                      previewOn={item.previewOn}
                      trimmedVideo={item.trimPreview}
                      editPreview={() => {
                        if (progressInfos.val[key]) {
                          handleEditVideoPreview(
                            item.previewUrl,
                            item.storageUrl,
                            item.orientation,
                            item.thumbnails,
                            item.imagePreview,
                            item.trimPreview
                          )
                        }
                      }}
                      handleToggleMediaLocked={handleToggleMediaLocked}
                      handleTogglePreviewOn={handleTogglePreviewOn}
                    />
                  </SwiperSlide>
                )
              }
            })}
            {!!selectedFiles.length && (
              <SwiperSlide>
                <AddAnything handleSetUpload={selectFiles} />
              </SwiperSlide>
            )}
          </Swiper>
        ) : (
          <SetPrice
            message={message}
            setMessage={setMessage}
            setPriceModalActive={setPriceModalActive}
            progressInfos={progressInfos}
            setProgressInfos={setProgressInfos}
          />
        )}
      </div>
    )
  }

  useEffect(() => {
    if (setGifOpenInfo) {
      setGifOpenInfo(gifOpen)
    }
  }, [gifOpen])

  useEffect(() => {
    if (onMessageChange) {
      onMessageChange(message)
    }
  }, [message])

  return (
    <>
      {hasGif && gifOpen && (
        <GifPopup closeFn={() => setGifOpen(false)} onGifClick={(gif: any) => (onGifClick ? onGifClick(gif) : null)} />
      )}
      {editPreviewModalOpen && videoPreviewData && (
        <EditPreviewModal
          defaultPreview={videoPreviewData.defaultPreview}
          storageSrc={videoPreviewData.storageSrc}
          thumbnails={videoPreviewData.thumbnails}
          thumbnailIndex={videoPreviewData.thumbnailIndex}
          trimPreview={videoPreviewData.trimPreview}
          orientation={videoPreviewData.orientation}
          cancelCb={() => {
            editPreviewModalOpen && setEditPreviewModalOpen(false)
          }}
          confirmCb={(
            data:
              | {
                  imagePrev: { previewUrl: string; defaultPrev: string }
                }
              | {
                  videoPrev: {
                    start: number
                    end: number
                    defaultPrev: string
                  }
                }
          ) => {
            handleUpdatePreview(data)
          }}
        />
      )}
      {renderAttachments()}
      {
        <div ref={replyRef} className={`write-message-reply ${reply ? 'write-message-reply-open' : ''}`}>
          <IconQuotes />
          {typeof reply?.body === 'string' ? (
            <p>{reply?.body}</p>
          ) : (
            reply && (
              <AudioMessage
                audioReady={true}
                waveHeight={30}
                timerTextSize={12}
                timerTextColor={reply?.recieved ? 'gray' : 'white'}
                waveColor={reply?.recieved ? 'gray' : 'white'}
                audioBlob={reply?.body.src || reply?.body.url || reply?.body.path || ''}
                customClass={`${messageStyles.message_sound_player} ${
                  reply?.recieved ? messageStyles.message_sound_player_recieved : ''
                } write-message-audio-reply`}
              />
            )
          )}
          <button className='write-message-reply-close' onClick={() => (setReply ? setReply(null) : null)}>
            <IconClose color='#ffffff' />
          </button>
        </div>
      }
      <WriteMessage
        message={message}
        setMessage={setMessage}
        uploadMedia={uploadFiles}
        selectFiles={selectFiles}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        sendMessage={() => sendMessage(prepareMessage(progressInfos.val))}
        customClass={writeMessageCustomClass}
        sending={!messageReady}
        setProgressInfos={setProgressInfos}
        progressInfos={progressInfos}
        setGifOpen={() => setGifOpen(!gifOpen)}
        hasGif={hasGif}
        removeFile={removeFile}
        onFocusIn={onFocusIn}
        onFocusOut={onFocusOut}
        setSchedule={(val: string) => setSchedule(val)}
        schedule={schedule}
        setReply={setReply}
        disabled={disabled}
      />
    </>
  )
}

export default CreateMessage
