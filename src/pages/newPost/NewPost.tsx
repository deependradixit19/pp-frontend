import ReactDom from 'react-dom'
import { FC, useState, useEffect, ChangeEvent, useRef, useCallback } from 'react'
import './_newPost.scss'
import { useNavigate, useLocation } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { produce } from 'immer'
import { useQueryClient, useQuery } from 'react-query'
import { useReactMediaRecorder } from 'react-media-recorder'
import { useTranslation } from 'react-i18next'
import { addToast } from '../../components/Common/Toast/Toast'

import 'swiper/css'

import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import PostInputs from './features/PostInputs'
import PostMediaInputs from './features/PostMediaInputs'

import PostVisibility from './components/PostVisibility'
import PostText from './components/PostText'
import PostImage from './components/PostImage'
import PostVideo from './components/PostVideo'
import AddAnything from './components/AddAnything'
import AudioMessage from '../../components/UI/AudioMessage/AudioMessage'

import { attachPhoto, attachVideo, attachAudio, getVideoThumbs } from '../../services/endpoints/attachments'
import { uploadGoal, uploadPoll, uploadPost } from '../../services/endpoints/posts'
import { ICategory, IGoal, IGroup, INewPost, IPoll, IProgressInfo, ITag } from '../../types/interfaces/ITypes'
import AddPoll from '../../features/AddPoll/AddPoll'
import PollPreview from './components/PollPreview'
import MediaRecorder from '../../features/MediaRecorder/MediaRecorder'
import EditPreviewModal from '../../components/UI/Modal/EditPreviewModal/EditPreviewModal'
import { randomString, validateText } from '../../helpers/util'
import { validateMedia, validateMediaFiles } from '../../helpers/media'
import { useModalContext } from '../../context/modalContext'
import PhotoEditView from '../../features/PhotoEdit/PhotoEditView'
import SelectCategoriesModal from '../../components/UI/Modal/SelectCategoriesModal/SelectCategoriesModal'
import { getMediaCategories } from '../../services/endpoints/mediaCategories'
import AddGoal from '../../features/AddGoal/AddGoal'
import GoalPreview from './components/GoalPreview/GoalPreview'
import IconButton from '../../components/UI/Buttons/IconButton'
import { AllIcons } from '../../helpers/allIcons'
import { useUserContext } from '../../context/userContext'
import { getBannedWords, putBannedWord } from '../../services/endpoints/api_global'

const NewPost: FC = () => {
  const [pollData, setPollData] = useState<IPoll | null>(null)
  const [goalData, setGoalData] = useState<IGoal | null>(null)
  const [post, setPost] = useState<INewPost>({
    body: '',
    tags: [],
    groups: [],
    categories: [],
    price: null,
    schedule_date: null,
    shareOnTwitter: false,
    photos: [],
    sounds: [],
    videos: []
  })

  const [postAudience, setPostAudience] = useState<IGroup[]>([])
  const [selectedCategories, setSelectedCateories] = useState<ICategory[]>([])

  const [postType, setPostType] = useState<string>('')

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [progressInfos, setProgressInfos] = useState<{ val: IProgressInfo[] }>({
    val: []
  })

  const [hasAudio, setHasAudio] = useState<boolean>(false)
  const [audioOnly, setAudioOnly] = useState<boolean>(false)

  const [postUploading, setPostUploading] = useState(false)
  const [postReady, setPostReady] = useState(false)

  const [recorderType, setRecorderType] = useState('')
  const [recordedChunks, setRecordedChunks] = useState([])

  const [reorderActive, setReorderActive] = useState<boolean>(false)

  const [newOrder, setNewOrder] = useState<IProgressInfo[]>([])
  const [newFileOrder, setNewFileOrder] = useState<File[]>([])

  const [addPollOpen, setAddPollOpen] = useState(false)
  const [addGoalOpen, setAddGoalOpen] = useState(false)

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

  const modalContext = useModalContext()
  const navigate = useNavigate()
  const location = useLocation()
  const progressInfosRef = useRef<any>(null)
  const modalData = useModalContext()
  const queryClient = useQueryClient()
  const userData = useUserContext()
  const { t } = useTranslation()

  const { data: bannedWordsData, isLoading: isLoadingBannedWords } = useQuery('banned-words', getBannedWords)

  const { status, error, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    audio: true,
    video: recorderType === 'video'
  })

  const confirmationMessage = t('videoUploadInProgressVideoWillNotBeSaved')
  const beforeUnloadHandler = (e: any) => {
    ;(e || window.event).returnValue = confirmationMessage

    return confirmationMessage
  }

  const prefetchCategories = async () => {
    await queryClient.prefetchQuery(['allMediaCategories'], getMediaCategories)
  }
  useEffect(() => {
    prefetchCategories()
  }, [])

  useEffect(() => {
    setNewOrder([])
  }, [reorderActive])

  useEffect(() => {
    if (!!post.photos.length || !!post.videos.length || !!post.sounds.length) {
      window.addEventListener('beforeunload', beforeUnloadHandler)
    }

    if (!post.price) {
      const tmpInfo = progressInfos.val.map(info => {
        return { ...info, locked: false }
      })
      setProgressInfos({ val: tmpInfo })
    }

    return () => window.removeEventListener('beforeunload', beforeUnloadHandler)
  }, [post])

  useEffect(() => {
    const unfinishedUploads = progressInfos.val.filter(el => el.percentage < 100)
    const audioFile = progressInfos.val.find(el => el.type === 'sound' || el.type === 'audio')

    if (audioFile) {
      setHasAudio(true)
    } else {
      setHasAudio(false)
    }
    const isValidText = validateText(post.body)

    if (!isValidText) {
      if (!!progressInfos.val.length) {
        if (!!unfinishedUploads.length) {
          postReady && setPostReady(false)
        } else {
          // !postReady && setPostReady(true);
        }
      } else {
        postReady && setPostReady(false)
      }
    } else {
      if (!!progressInfos.val.length) {
        if (!!unfinishedUploads.length) {
          postReady && setPostReady(false)
        } else {
          // !postReady && setPostReady(true);
        }
      } else {
        !postReady && setPostReady(true)
      }
    }
  }, [post, progressInfos])

  useEffect(() => {
    if (
      progressInfos.val.length === 1 &&
      (progressInfos.val[0].type === 'sound' || progressInfos.val[0].type === 'audio')
    ) {
      setAudioOnly(true)
    } else {
      audioOnly && setAudioOnly(false)
    }
  }, [progressInfos])

  useEffect(() => {
    const convertBlob = async (blob: any) => {
      let file = await fetch(blob)
        .then(r => r.blob())
        .then(blobFile => {
          return new File([blobFile], randomString(blobFile.type), {
            type: blobFile.type
          })
        })

      setSelectedFiles([...selectedFiles, file])
      uploadFiles([file])
      setPostType('media')
      setProgressInfos({ val: [...progressInfos.val] })
      setRecordedChunks([])
    }

    if (mediaBlobUrl) convertBlob(mediaBlobUrl)

    //eslint-disable-next-line
  }, [mediaBlobUrl])

  useEffect(() => {
    const convertBlob = (blob: any) => {
      const file = new File([blob[0]], randomString(blob[0].type), {
        type: blob[0].type
      })

      setSelectedFiles([...selectedFiles, file])
      uploadFiles([file])
      setPostType('media')
      setProgressInfos({ val: [...progressInfos.val] })
      setRecordedChunks([])
    }

    if (recordedChunks.length) convertBlob(recordedChunks)

    //eslint-disable-next-line
  }, [recordedChunks])

  useEffect(() => {
    initializeDateFromQuery()
  }, [])

  const initializeDateFromQuery = () => {
    if (location.search) {
      const dateString = location.search.split('?date=')[1]
      setPost(prevValue => ({
        ...prevValue,
        schedule_date: new Date(dateString)
      }))
    }
  }

  const getPreviewStatus = (status: string) => {
    if (status === 'no-preview') {
      return false
    }
    return true
  }

  const handleNewOrder = (item: IProgressInfo) => {
    const fileIndex = progressInfos.val.indexOf(item)
    if (newOrder.includes(item)) {
      const afterRemoveItem = newOrder.filter((file: any) => file !== item)
      const afterRemoveFileItem = newFileOrder.filter((file: File) => file !== selectedFiles[fileIndex])
      setNewOrder(afterRemoveItem)
      setNewFileOrder(afterRemoveFileItem)
    } else {
      const filteredProgInfos = newOrder.filter((file: any) => file !== item)
      const filteredFiles = newFileOrder.filter((file: File) => file !== selectedFiles[fileIndex])
      const tmpArr = [...filteredProgInfos, item]
      const tmpFileArray = [...filteredFiles, selectedFiles[fileIndex]]
      setNewOrder(tmpArr)
      setNewFileOrder(tmpFileArray)
    }
  }

  const handleConfirmReorder = () => {
    const confirmedReorderArr = progressInfos.val.filter((info: IProgressInfo) => !newOrder.includes(info))
    const confirmedReorderFileArr = selectedFiles.filter((file: File) => !newFileOrder.includes(file))

    const tmpProgInfOrder = [...newOrder, ...confirmedReorderArr]
    const tmpFileOrder = [...newFileOrder, ...confirmedReorderFileArr]

    setNewOrder(tmpProgInfOrder)
    setProgressInfos({ val: tmpProgInfOrder })
    setSelectedFiles(tmpFileOrder)
    setReorderActive(false)
  }

  const handleOpenCategories = () => {
    modalData.addModal(
      t('categories'),
      <SelectCategoriesModal
        // categories={data?.data}
        selectedCategories={selectedCategories}
        onCancel={handleCloseCategories}
        onSave={selected => {
          setSelectedCateories(selected)
          modalData.clearModal()
        }}
      />,
      false,
      true,
      'selectCategories'
    )
  }
  const handleCloseCategories = () => {
    modalData.clearModal()
  }
  const handleUploadAbort = (key: number) => {
    setProgressInfos({
      val: progressInfos.val.filter((item, i) => i !== key)
    })
  }
  const selectFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    postReady && setPostReady(false)
    const tmpFiles = event.target.files

    if (!tmpFiles || !tmpFiles.length) {
      return
    }

    // const files = Array.from(tmpFiles);
    const files = await validateMediaFiles(Array.from(tmpFiles), t)
    const audioFiles = files.filter(file => file.type.includes('audio/'))
    const prevAudioFiles = progressInfos.val.filter(info => info.type === 'sound' || info.type === 'audio')
    const videoPhotoFiles = files.filter(file => {
      return file.type.includes('video/') || file.type.includes('image/')
    })
    const tmpVideoPhotoFiles = videoPhotoFiles.filter(file => {
      const res = !selectedFiles.some(el => {
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
    setPostType('media')
  }

  const removeFile = (index: number) => {
    const tmpProgressInfos = progressInfos.val.filter((info: any) => progressInfos.val.indexOf(info) !== index)
    const tmpSelectedFiles = selectedFiles.filter((file: any) => selectedFiles.indexOf(file) !== index)

    if (!tmpProgressInfos.length) {
      postReady && setPostReady(false)
      setPostType('')
    }
    setProgressInfos({ val: [...tmpProgressInfos] })
    progressInfosRef.current = { val: tmpProgressInfos }
    setSelectedFiles(tmpSelectedFiles)
  }

  useEffect(() => {
    if (localStorage.getItem('share-post')) {
      ;(async () => {
        const sharedPostArray = localStorage.getItem('share-post')
        const parsedArray = sharedPostArray && JSON.parse(sharedPostArray)

        const _progressInfos = progressInfosRef.current ? [...progressInfosRef?.current?.val] : []

        const idsArray = parsedArray.map((media: any) => {
          if (media.post) {
            if (media.post.videos.length > 0) {
              return media.post.videos.map((video: any) => video.id)
            }
          }

          if (media.message?.message) {
            if (media.message.message.videos.length > 0) {
              return media.message.message.videos.map((video: any) => video.id)
            }
          }

          if (media.story) {
            if (media.story.video_id) {
              return media.story.video_id
            }
            return null
          }

          return null
        })

        const idsArrayConcated = idsArray.concat.apply([], idsArray).filter((item: number) => !!item)

        const thumbsData = await getVideoThumbs(idsArrayConcated)
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
                let thumbnails: string[] = []
                let activeImage = undefined
                if (thumbsData?.data?.data) {
                  const thumbsTemp = thumbsData.data.data.filter((thumb: any) => thumb.id === video.id)[0]
                  thumbnails = thumbsTemp.thumbs
                    .filter((thumb: any) => thumb.type === 'thumb')
                    .map((thumb: any) => {
                      if (thumb?.active) {
                        activeImage = thumb.src
                      }
                      return thumb?.src
                    })
                }
                _progressInfos.push({
                  id: video.id,
                  cancel: () => {},
                  error: '',
                  fileName: `shared-video-${video.id}`,
                  locked: false,
                  orientation: video.orientation,
                  ...(video.duration && { duration: video.duration }),
                  percentage: 100,
                  imagePreview: activeImage,
                  previewUrl: video.url,
                  storageUrl: video.url,
                  type: 'video',
                  previewOn: false,
                  thumbnails: thumbnails
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
              let thumbnails: string[] = []
              let activeImage = undefined
              if (thumbsData?.data?.data && story.video_id) {
                const thumbsTemp = thumbsData.data.data.filter((thumb: any) => thumb.id === story.video_id)[0]
                thumbnails = thumbsTemp.thumbs
                  .filter((thumb: any) => thumb.type === 'thumb')
                  .map((thumb: any) => {
                    if (thumb?.active) {
                      activeImage = thumb.src
                    }
                    return thumb?.src
                  })
              }
              _progressInfos.push({
                id: story.id,
                cancel: () => {},
                error: '',
                fileName: `shared-story-video-${story.id}`,
                locked: false,
                orientation: story.video_orientation,
                percentage: 100,
                imagePreview: activeImage,
                previewUrl: story.video_src,
                storageUrl: story.video_src,
                type: 'video',
                thumbnails: thumbnails,
                previewOn: false
              })
            }
          }
          if (parsedArray[i].message?.message) {
            if (parsedArray[i].message.message.photos) {
              const photos = parsedArray[i].message.message.photos
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
            if (parsedArray[i].message?.message.videos.length > 0) {
              const videos = parsedArray[i].message.message.videos
              videos.forEach((video: any, index: number) => {
                let thumbnails: string[] = []
                let activeImage = undefined
                if (thumbsData?.data?.data) {
                  const thumbsTemp = thumbsData.data.data.filter((thumb: any) => thumb.id === video.id)[0]
                  thumbnails = thumbsTemp.thumbs
                    .filter((thumb: any) => thumb.type === 'thumb')
                    .map((thumb: any) => {
                      if (thumb?.active) {
                        activeImage = thumb.src
                      }
                      return thumb?.src
                    })
                }
                _progressInfos.push({
                  id: video.id,
                  cancel: () => {},
                  error: '',
                  fileName: `shared-video-${video.id}`,
                  locked: false,
                  orientation: video.orientation,
                  percentage: 100,
                  imagePreview: activeImage,
                  previewUrl: video.url,
                  storageUrl: video.url,
                  type: 'video',
                  previewOn: false,
                  thumbnails: thumbnails
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

        setPostReady(true)

        // localStorage.removeItem("share-post");
      })()

      localStorage.removeItem('share-post')
    }
  }, [])

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
            _progressInfos[index].locked = !!post.price
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
            _progressInfos[index].duration = res.data.duration
            _progressInfos[index].thumbnails = res.data.thumbs
            _progressInfos[index].locked = !!post.price

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
            _progressInfos[index].locked = !!post.price
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
        setPostReady(true)
      })
      .catch(err => {
        postReady && setPostReady(false)
      })
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

  const handlePollSubmit = (pollData: IPoll) => {
    if (pollData.pollBgImg) {
      const data = new FormData()
      data.append('photo', pollData.pollBgImg)
      attachPhoto(data, percentage => console.log(percentage + '%'))
        .then(res => {
          uploadPoll({
            type: pollData.type,
            question: pollData.question,
            groups: extractGroupIds(postAudience),
            answers: pollData.answers,
            background_color: null,
            background_src: res.data.path
          })
            .then(pollRes => {
              addToast('success', t('postCreatedSuccessfully'))
              queryClient.invalidateQueries('getFeed')
              navigate(`/profile/${userData.id}/all`)
            })
            .catch(pollErr => console.log(pollErr))
        })
        .catch(err => console.log(err))
    } else {
      uploadPoll({
        type: pollData.type,
        question: pollData.question,
        groups: extractGroupIds(postAudience),
        answers: pollData.answers,
        background_color: pollData.pollBg,
        background_src: null
      })
        .then(pollRes => {
          addToast('success', t('postCreatedSuccessfully'))
          queryClient.invalidateQueries('getFeed')
          navigate(`/profile/${userData.id}/all`)
        })
        .catch(pollErr => console.log(pollErr))
    }
  }
  const handleGoalSubmit = (goalData: IGoal) => {
    if (goalData.goalBgImg) {
      const data = new FormData()
      data.append('photo', goalData.goalBgImg)
      attachPhoto(data, percentage => console.log(percentage + '%'))
        .then(res => {
          uploadGoal({
            text: goalData.title,
            goal: goalData.amount,
            groups: extractGroupIds(postAudience),
            background_color: null,
            background_src: res.data.path
          })
            .then(goalRes => {
              addToast('success', t('postCreatedSuccessfully'))
              queryClient.invalidateQueries('getFeed')
              navigate(`/profile/${userData.id}/all`)
            })
            .catch(goalRes => console.log(goalRes))
        })
        .catch(err => console.log(err))
    } else {
      uploadGoal({
        text: goalData.title,
        goal: goalData.amount,
        groups: extractGroupIds(postAudience),
        background_color: goalData.goalBg,
        background_src: null
      })
        .then(goalRes => {
          addToast('success', t('postCreatedSuccessfully'))
          queryClient.invalidateQueries('getFeed')
          navigate(`/profile/${userData.id}/all`)
        })
        .catch(goalRes => console.log(goalRes))
    }
  }

  const preparePost = (progInfos: IProgressInfo[]) => {
    const findPaths = (term: string) =>
      progInfos.filter((item: IProgressInfo) => {
        if (item.previewUrl.includes(term)) {
          return item
        }
      })
    const finishedPost = {
      body: post.body,
      // audience: postData.audience?.name || 'public',
      photos: findPaths('/public/images').map((item: IProgressInfo) => {
        return {
          path: item.previewUrl,
          order: progressInfos.val.indexOf(item) + 1,
          orientation: item.orientation,
          locked: item.locked,
          text: item.text
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
          duration: item.duration
        }
      }),
      sounds: findPaths('/public/sound').map((item: any) => {
        return {
          path: item.previewUrl,
          order: progressInfos.val.indexOf(item) + 1,
          locked: item.locked
        }
      }),
      price: post.price,
      groups: extractGroupIds(postAudience),
      categories: extractCategoryIds(selectedCategories),
      tags: post.tags,
      schedule_date: post.schedule_date,
      shareOnTwitter: post.shareOnTwitter
    }

    return finishedPost
  }

  const submitPost = () => {
    let usedBannedWords = []
    setPostUploading(true)
    if (!isLoadingBannedWords && bannedWordsData?.data?.length > 0) {
      for (let i = 0; i < bannedWordsData.data.length; i++) {
        if (post.body.trim().toLowerCase().includes(bannedWordsData.data[i].word.toLowerCase())) {
          usedBannedWords.push(bannedWordsData.data[i].word)
          putBannedWord({ id: bannedWordsData.data[i].id, type: 'post' })
        }
      }
    }

    if (userData.status === 'restricted') {
      addToast('error', t('postRestrictedAcc'))
    } else if (usedBannedWords.length > 0) {
      usedBannedWords.forEach((word: string) => addToast('error', `${t('postContainsBannedWord')} - ${word}`))
    } else {
      if (pollData) {
        handlePollSubmit(pollData)
      } else if (goalData) {
        handleGoalSubmit(goalData)
      } else {
        const post = preparePost(progressInfos.val)

        if (post.price && !post.body && !post.photos.length && !post.videos.length) {
          addToast('error', t('validation:premiumPostCannotBeAudioOnly'))
          return
        }
        post &&
          uploadPost({
            ...post
          })
            .then(() => {
              addToast('success', t('postCreatedSuccessfully'))
              queryClient.invalidateQueries('getFeed')
              navigate(`/profile/${userData.id}/all`)
            })
            .catch(err => {
              addToast('error', t('error:errorSomethingWentWrong'))
            })
            .finally(() => {
              setPostUploading(false)
            })
      }
    }
  }

  const extractGroupIds = (groups: IGroup[]) => {
    const groupIds = groups.map(group => {
      return group.id
    })

    return groupIds || []
  }
  const extractCategoryIds = (categories: ICategory[]) => {
    const categoryIds = categories.map(categorie => {
      return categorie.id
    })

    return categoryIds || []
  }

  const renderContent = () => {
    if (pollData) {
      return (
        <PollPreview
          pollData={pollData}
          clearPollData={() => {
            setPostType('')
            setPollData(null)
          }}
        />
      )
    } else if (goalData) {
      return (
        <GoalPreview
          goalData={goalData}
          clearGoalData={() => {
            setPostType('')
            setGoalData(null)
          }}
        />
      )
    } else {
      return (
        <PostText
          body={post.body}
          tags={post.tags}
          setText={(body: string, tags: ITag[]) => setPost({ ...post, body, tags })}
        />
      )
    }
  }

  if (addPollOpen) {
    const portal = document.getElementById('portal')

    if (!portal) return null
    !portal.classList.contains('portal--open') && portal.classList.add('portal--open')
    return ReactDom.createPortal(
      <AddPoll
        handleClose={() => {
          portal.classList.contains('portal--open') && portal.classList.remove('portal--open')
          setAddPollOpen(false)
        }}
        handleSetPollData={(data: IPoll) => {
          setPostType('poll')
          portal.classList.contains('portal--open') && portal.classList.remove('portal--open')
          setPollData(data)
        }}
      />,
      portal
    )
  }
  if (addGoalOpen) {
    const portal = document.getElementById('portal')

    if (!portal) return null
    !portal.classList.contains('portal--open') && portal.classList.add('portal--open')
    return ReactDom.createPortal(
      <AddGoal
        handleClose={() => {
          portal.classList.contains('portal--open') && portal.classList.remove('portal--open')
          setAddGoalOpen(false)
        }}
        handleSetGoalData={(data: IGoal) => {
          setPostType('goal')
          setGoalData(data)
          portal.classList.contains('portal--open') && portal.classList.remove('portal--open')
          setAddGoalOpen(false)
        }}
      />,
      portal
    )
  }
  return (
    <BasicLayout
      title={editPreviewModalOpen ? t('editPreview') : t('newPost')}
      hideFooter={editPreviewModalOpen}
      handleGoBack={editPreviewModalOpen ? () => setEditPreviewModalOpen(false) : undefined}
      // this should open model-general-post-settings
      headerRightEl={
        editPreviewModalOpen ? (
          <IconButton
            icon={AllIcons.button_settings}
            type={'black'}
            customClass='newpost__editPreview__settings'
            clickFn={() => {
              navigate('/settings/general/post-settings')
            }}
          />
        ) : undefined
      }
    >
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
      {recorderType && (
        <MediaRecorder
          type={recorderType}
          status={status}
          handleClose={() => {
            setRecorderType('')
          }}
          setRecordedChunks={data => setRecordedChunks(data)}
          handleAudioStart={() => {
            startRecording()
          }}
          handleAudioStop={stopRecording}
        />
      )}
      <div className={`newpost ${pollData || goalData ? 'newpost--pollPreview' : ''}`}>
        <PostVisibility
          isEdit={false}
          audience={postAudience}
          setAudience={(val: IGroup[]) => {
            setPostAudience(val)
          }}
        />

        <div className={`newpost__body`}>
          {renderContent()}

          <div className='newpost__body__bottom'>
            {progressInfos.val.map((item: IProgressInfo, key: number) => {
              return (
                (item.type === 'sound' || item.type === 'audio') && (
                  <AudioMessage
                    key={key}
                    customClass={`newpost__audiomessage ${audioOnly ? '' : 'newpost__audiomessage--active'}`}
                    audioBlob={item.previewUrl}
                    audioReady={!!item.previewUrl}
                    waveColor='gray'
                    waveBackgroundColor='transparent'
                    processing={item.percentage > 0 && item.percentage < 100}
                    percentage={item.percentage}
                    uploadError={item.error}
                    hasDeleteBtn={true}
                    deleteFn={() => {
                      item.cancel()
                      removeFile(key)
                    }}
                  />
                )
              )
            })}

            <PostMediaInputs
              filesAdded={(!!progressInfos.val.length && !audioOnly) || !!pollData || !!goalData}
              handleSetUpload={selectFiles}
              toggleReorder={() => setReorderActive(!reorderActive)}
              handleAddPollOpen={() => setAddPollOpen(true)}
              handleAddGoalOpen={() => setAddGoalOpen(true)}
              reorderActive={reorderActive}
              confirmReorder={handleConfirmReorder}
              postType={postType}
              handleOpenRecorder={(type: string) => setRecorderType(type)}
              hasAudio={hasAudio}
            />

            {!pollData && !goalData && (
              <div
                className={`newpost__body__media ${
                  !!progressInfos.val.length && !audioOnly ? 'newpost__body__media--active' : ''
                }`}
              >
                <div className={`newpost__body__media__wrapper `}>
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
                              abortUploadCb={() => {
                                item.cancel()
                                handleUploadAbort(key)
                              }}
                              uploadError={item.error}
                              previewUrl={item.previewUrl}
                              locked={item.locked}
                              isPremium={!!post.price}
                              removeFile={() => {
                                removeFile(key)
                              }}
                              removeByUrl={() => removeFile(key)}
                              reorderActive={reorderActive}
                              reorderNumber={newOrder.indexOf(item)}
                              updateOrder={() => handleNewOrder(item)}
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
                              handleToggleMediaLocked={handleToggleMediaLocked}
                            />
                          </SwiperSlide>
                        )
                      }
                      if (item.type === 'video') {
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
                              isPremium={!!post.price}
                              removeFile={() => {
                                removeFile(key)
                              }}
                              removeByUrl={() => removeFile(key)}
                              reorderNumber={newOrder.indexOf(item)}
                              reorderActive={reorderActive}
                              updateOrder={() => handleNewOrder(item)}
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
                              previewOn={item.previewOn}
                              trimmedVideo={item.trimPreview}
                              handleToggleMediaLocked={handleToggleMediaLocked}
                              handleTogglePreviewOn={handleTogglePreviewOn}
                            />
                          </SwiperSlide>
                        )
                      }
                    })}
                    {!reorderActive && !!progressInfos.val.length && !audioOnly ? (
                      <SwiperSlide>
                        <AddAnything handleSetUpload={selectFiles} />
                      </SwiperSlide>
                    ) : (
                      ''
                    )}
                  </Swiper>
                </div>
              </div>
            )}
            <PostInputs
              isUploading={postUploading}
              price={post.price}
              hasCategories={!!selectedCategories.length}
              setPrice={(val: number) => {
                if (!!val) {
                  const tmpInfo = progressInfos.val.map(info => {
                    return { ...info, locked: true }
                  })
                  setProgressInfos({ val: tmpInfo })
                }
                setPost({ ...post, price: val })
              }}
              submitPost={submitPost}
              postReady={postReady || !!pollData || !!goalData}
              updateDate={(val: Date) => {
                const now = new Date()
                if (val < now) {
                  addToast('error', t('error:errorInvalidDate'))
                } else {
                  setPost({ ...post, schedule_date: val })
                }
              }}
              scheduleDate={post.schedule_date}
              removeSchedule={() => setPost({ ...post, schedule_date: null })}
              shareOnTwitter={post.shareOnTwitter}
              addCategories={handleOpenCategories}
              toggleShareOnTwitter={() => {
                setPost({
                  ...post,
                  shareOnTwitter: !post.shareOnTwitter
                })
              }}
            />
          </div>
        </div>
      </div>
    </BasicLayout>
  )
}

export default NewPost
