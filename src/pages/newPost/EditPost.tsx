import ReactDom from 'react-dom'
import { FC, useState, useEffect, useCallback, ChangeEvent, useRef } from 'react'
import './_newPost.scss'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from 'react-query'
import { produce } from 'immer'
import _ from 'lodash'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import { useReactMediaRecorder } from 'react-media-recorder'

import { AxiosError, AxiosPromise } from 'axios'
import { useTranslation } from 'react-i18next'
import { addToast } from '../../components/Common/Toast/Toast'

import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import PostInputs from './features/PostInputs'
import PostMediaInputs from './features/PostMediaInputs'

import PostVisibility from './components/PostVisibility'
import PostText from './components/PostText'
import PostImage from './components/PostImage'
import PostVideo from './components/PostVideo'
import AddAnything from './components/AddAnything'
import AudioMessage from '../../components/UI/AudioMessage/AudioMessage'

import { attachPhoto, attachVideo, attachAudio, editPhoto, getVideoThumbs } from '../../services/endpoints/attachments'
import { editPost, getGroupsForSinglePost, getSinglePost, uploadGoal, uploadPoll } from '../../services/endpoints/posts'
import { ICategory, IGoal, IGroup, INewPost, IPoll, IProgressInfo, ITag } from '../../types/interfaces/ITypes'
import AddPoll from '../../features/AddPoll/AddPoll'
import PollPreview from './components/PollPreview'
import MediaRecorder from '../../features/MediaRecorder/MediaRecorder'

import EditPreviewModal from '../../components/UI/Modal/EditPreviewModal/EditPreviewModal'
import { randomString, validateMedia, validateText } from '../../helpers/util'
import { useUserContext } from '../../context/userContext'
import PhotoEditView from '../../features/PhotoEdit/PhotoEditView'
import { useModalContext } from '../../context/modalContext'
import SelectCategoriesModal from '../../components/UI/Modal/SelectCategoriesModal/SelectCategoriesModal'
import { getMediaCategoriesForSinglePost } from '../../services/endpoints/mediaCategories'
import AddGoal from '../../features/AddGoal/AddGoal'
import GoalPreview from './components/GoalPreview/GoalPreview'
import { validateMediaFiles } from '../../helpers/media'

interface IMediaToDelete {
  photos: number[]
  videos: number[]
  sounds: number[]
}
interface IReorder {
  type: string
  id: number
  order: number
}

const EditPost: FC = () => {
  const [pollData, setPollData] = useState<IPoll | null>(null)
  const [goalData, setGoalData] = useState<IGoal | null>(null)
  const [post, setPost] = useState<INewPost>({
    body: '',
    groups: [],
    categories: [],
    tags: [],
    price: null,
    schedule_date: null,
    shareOnTwitter: false,
    photos: [],
    sounds: [],
    videos: []
  })
  const [postInitialState, setPostInitialState] = useState<INewPost>({
    body: '',
    groups: [],
    categories: [],
    tags: [],
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
  const [postDirty, setPostDirty] = useState<boolean>(false)

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [initialProgress, setInitialProgress] = useState<{
    val: IProgressInfo[]
  }>({
    val: []
  })
  const [progressInfosNew, setProgressInfosNew] = useState<{
    val: IProgressInfo[]
  }>({
    val: []
  })
  const [progressInfos, setProgressInfos] = useState<{ val: IProgressInfo[] }>({
    val: []
  })
  const [mediaToDelete, setMediaToDelete] = useState<IMediaToDelete>({
    photos: [],
    videos: [],
    sounds: []
  })

  const [hasAudio, setHasAudio] = useState<boolean>(false)
  const [audioOnly, setAudioOnly] = useState<boolean>(false)

  const [postReady, setPostReady] = useState(true)

  const [recorderType, setRecorderType] = useState('')
  const [recordedChunks, setRecordedChunks] = useState([])

  const [reorderActive, setReorderActive] = useState<boolean>(false)

  const [newOrder, setNewOrder] = useState<IProgressInfo[]>([])
  const [reorder, setReorder] = useState<IReorder[]>([])

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
    thumbType?: 'clip' | 'thumb'
  } | null>(null)
  let postEmpty = !Boolean(
    progressInfos.val.length > 0 || progressInfosNew.val.length > 0 || initialProgress.val.length > 0
  )
  const navigate = useNavigate()
  const progressInfosRef = useRef<any>(null)
  const queryClient = useQueryClient()
  const userData = useUserContext()
  const params = useParams<{ id: string }>()
  const modalContext = useModalContext()
  const { t } = useTranslation()

  const postId = Number(params.id)

  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    audio: true,
    video: recorderType === 'video'
  })

  const { data, error } = useQuery(['getSinglePost', postId], () => getSinglePost(postId), {
    refetchOnWindowFocus: false
  })

  const { data: postGroupsData, error: postGroupsError } = useQuery(
    ['getGroupsForSinglePost', postId],
    () => getGroupsForSinglePost(postId),
    {
      refetchOnWindowFocus: false
    }
  )
  const { data: postCategoriesData, error: postCategoriesError } = useQuery(['allMediaCategories', postId], () =>
    getMediaCategoriesForSinglePost(postId)
  )

  if (
    (error as AxiosError)?.response?.status === 404 ||
    (postGroupsError as AxiosError)?.response?.status === 404 ||
    (postCategoriesError as AxiosError)?.response?.status === 404
  ) {
    navigate('/404', { replace: true })
  }

  const confirmationMessage = t('videoUploadInProgressVideoWillNotBeSaved')
  const beforeUnloadHandler = (e: any) => {
    ;(e || window.event).returnValue = confirmationMessage

    return confirmationMessage
  }

  useEffect(() => {
    setNewOrder([])
  }, [reorderActive])

  useEffect(() => {
    if (data && postGroupsData && postCategoriesData) {
      ;(async () => {
        const selected = postGroupsData.data.filter((group: IGroup) => {
          return group.selected
        })
        const selectedCat = postCategoriesData.data.filter((category: ICategory) => {
          return category.selected
        })
        setPostAudience(selected)
        setSelectedCateories(selectedCat)
        if (data.data.poll) {
          setPostType('poll')
          setPollData({
            type: data.data.poll.type,
            question: data.data.poll.question,
            pollBg: data.data.poll.background_color,
            pollBgImg: data.data.poll.background_src,
            answers: [...data.data.poll.answers_count.map((el: any) => el.text)]
          })
        } else if (data.data.goal) {
          setPostType('goal')
          setGoalData({
            title: data.data.goal.text,
            amount: data.data.goal.goal,
            goalBg: data.data.goal.background_color,
            goalBgImg: data.data.goal.background_src
          })
        } else {
          const allMedia = [...data.data.photos, ...data.data.videos, ...data.data.sounds]
          const sorted = allMedia.sort((a, b) => a.order - b.order)
          const thumbsIds = sorted
            .map((media: any) => (media.type === 'video' ? media.id : null))
            .filter((media: any) => !!media)

          const thumbsData = await getVideoThumbs(thumbsIds)
          //ovde
          const tmpProgressInfos = sorted.map(item => {
            if (item?.type === 'video') {
              let thumbnails = []
              let activeImage = undefined
              if (thumbsData?.data?.data) {
                const thumbsTemp = thumbsData?.data.data?.filter(
                  (thumb: { id: number; thumbs: [] }) => item.id === thumb.id
                )[0]
                thumbnails = thumbsTemp.thumbs
                  .filter((thumb: any) => thumb.type === 'thumb')
                  .map((thumb: any) => {
                    if (thumb?.active) {
                      activeImage = thumb.src
                    }

                    return thumb?.src
                  })
              }
              return {
                percentage: 100,
                cancel: () => {},
                error: '',
                fileName: item.url,
                previewUrl: item.url,
                storageUrl: '',
                locked: !!item.locked,
                orientation: item.orientation,
                ...(item.duration && { duration: item.duration }),
                thumbnails: thumbnails,
                thumbType: item?.thumb_type,
                imagePreview: activeImage,
                type: item.type,
                previewOn: !!item.preview,
                id: item.id,
                text: item.text
              }
            }

            return {
              percentage: 100,
              cancel: () => {},
              error: '',
              fileName: item.url,
              previewUrl: item.url,
              storageUrl: '',
              locked: !!item.locked,
              orientation: item.orientation,
              thumbnails: [],
              type: item.type,
              previewOn: !!item.preview,
              id: item.id,
              text: item.text
            }
          })

          setProgressInfos({ val: tmpProgressInfos })
        }

        const normalizedTags = data.data.tags.map((tag: any) => ({
          start: tag.start,
          end: tag.end,
          user_id: tag.user.id
        }))

        setPost({
          body: data.data.body || '',
          groups: [],
          categories: [],
          tags: normalizedTags,
          price: data.data.price,
          schedule_date: data.data.schedule_date,
          shareOnTwitter: false,
          photos: [],
          sounds: [],
          videos: []
        })
        setPostInitialState({
          body: data.data.body || '',
          groups: [],
          categories: [],
          tags: normalizedTags,
          price: data.data.price,
          schedule_date: data.data.schedule_date,
          shareOnTwitter: false,
          photos: [],
          sounds: [],
          videos: []
        })
      })()
    }
  }, [data, postGroupsData, postCategoriesData])

  useEffect(() => {
    const isClean = _.isEqual(post, postInitialState)
    const isMediaClean = _.isEqual(progressInfosNew, initialProgress)
    if (
      !isClean ||
      !isMediaClean ||
      mediaToDelete.photos.length ||
      mediaToDelete.videos.length ||
      mediaToDelete.sounds.length
    ) {
      setPostDirty(true)
    } else {
      setPostDirty(false)
    }
  }, [post, postInitialState, progressInfosNew, mediaToDelete])

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

    if (progressInfos.val.length) {
      setPostType('media')
    }

    if (
      progressInfos.val.length === 1 &&
      (progressInfos.val[0].type === 'sound' || progressInfos.val[0].type === 'audio')
    ) {
      setAudioOnly(true)
    } else {
      setAudioOnly(false)
    }
    const isValidText = validateText(post.body)
    if (isValidText) {
      if (!!progressInfos.val.length) {
        if (!!unfinishedUploads.length) {
          postReady && setPostReady(false)
        } else {
          // !postReady && setPostReady(true);
        }
      } else {
        !postReady && setPostReady(true)
      }
    } else {
      if (!!progressInfos.val.length) {
        if (!!unfinishedUploads.length) {
          postReady && setPostReady(false)
        } else {
          !postReady && setPostReady(true)
        }
      } else {
        !postReady && setPostReady(true)
      }
    }
  }, [post, progressInfos])

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
      postReady && setPostReady(false)
      !postDirty && setPostDirty(true)
    }

    if (recordedChunks.length) convertBlob(recordedChunks)

    //eslint-disable-next-line
  }, [recordedChunks])

  const getPreviewStatus = (status: string) => {
    if (status === 'no-preview') {
      return false
    }
    return true
  }

  const handleNewOrder = (item: IProgressInfo) => {
    if (newOrder.includes(item)) {
      const afterRemoveItem = newOrder.filter(info => info !== item)
      setNewOrder(afterRemoveItem)
    } else {
      const filteredFiles = newOrder.filter(info => info !== item)
      const tmpArr = [...filteredFiles, item]
      setNewOrder(tmpArr)
    }
  }

  const handleConfirmReorder = () => {
    const confirmedReorderArr = progressInfos.val.filter((info: IProgressInfo) => !newOrder.includes(info))
    const tmpFileOrder = [...newOrder, ...confirmedReorderArr]
    const newProgInfo = tmpFileOrder.map(file => {
      return progressInfos.val.filter((info: any) => info.fileName === file.fileName)[0]
    })
    const reorderInfo = newProgInfo.map((el, idx) => {
      return {
        type: el.type,
        id: el.id,
        order: idx + 1
      }
    })
    setReorder(reorderInfo)
    setNewOrder(tmpFileOrder)
    setProgressInfos({ val: newProgInfo })
    setReorderActive(false)
    !postDirty && setPostDirty(true)
  }

  const handleOpenCategories = () => {
    modalContext.addModal(
      t('categories'),
      <SelectCategoriesModal
        categories={postCategoriesData.data}
        selectedCategories={selectedCategories}
        onCancel={handleCloseCategories}
        onSave={selected => {
          setSelectedCateories(selected)
          !postDirty && setPostDirty(true)
          modalContext.clearModal()
        }}
      />,
      false,
      true,
      'selectCategories'
    )
  }
  const handleCloseCategories = () => {
    modalContext.clearModal()
  }

  const selectFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    postReady && setPostReady(false)
    !postDirty && setPostDirty(true)
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
      } else {
        uploadFiles([...tmpVideoPhotoFiles, audioFiles[0]])
      }
    } else {
      uploadFiles(tmpVideoPhotoFiles)
    }
    setPostType('media')
  }

  const removeMedia = (media: IProgressInfo) => {
    const tmpProgressInfos = progressInfos.val.filter((info: any) => info.fileName !== media.fileName)
    const tmpProgressInfosNew = progressInfosNew.val.filter((info: any) => info.fileName !== media.fileName)
    if (!tmpProgressInfos.length && !tmpProgressInfosNew.length) {
      setPostType('')
    }
    progressInfosRef.current.val = tmpProgressInfosNew
    setProgressInfosNew({ val: [...tmpProgressInfosNew] })
    setProgressInfos({ val: [...tmpProgressInfos] })
  }
  const removeByUrl = (url: string) => {
    const tmpProgressInfos = progressInfos.val.filter((info: IProgressInfo) => {
      if (info.fileName === url) {
        const tmp: IMediaToDelete = { ...mediaToDelete }
        if (info.id && info.type === 'photo') tmp.photos.push(info.id)
        if (info.id && info.type === 'video') tmp.videos.push(info.id)
        if (info.id && info.type === 'sound') tmp.sounds.push(info.id)
        setMediaToDelete(tmp)
      }
      return info.previewUrl !== url
    })
    const tmpProgressInfosNew = progressInfosNew.val.filter((info: IProgressInfo) => {
      return info.previewUrl !== url
    })
    if (!tmpProgressInfos.length && !tmpProgressInfosNew.length) {
      setPostType('')
    }
    // progressInfosRef.current.val = tmpProgressInfosNew;
    setProgressInfosNew({ val: [...tmpProgressInfosNew] })
    setProgressInfos({ val: [...tmpProgressInfos] })

    !postDirty && setPostDirty(true)
  }

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
            setProgressInfosNew({
              val: [...progressInfosNew.val, ..._progressInfos]
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
            setProgressInfosNew({
              val: [...progressInfosNew.val, ..._progressInfos]
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
            setProgressInfosNew({
              val: [...progressInfosNew.val, ..._progressInfos]
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
            setProgressInfosNew({
              val: [...progressInfosNew.val, ..._progressInfos]
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
            setProgressInfosNew({
              val: [...progressInfosNew.val, ..._progressInfos]
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
            setProgressInfosNew({
              val: [...progressInfosNew.val, ..._progressInfos]
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
            setProgressInfosNew({
              val: [...progressInfosNew.val, ..._progressInfos]
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
            setProgressInfosNew({
              val: [...progressInfosNew.val, ..._progressInfos]
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
            setProgressInfosNew({
              val: [...progressInfosNew.val, ..._progressInfos]
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
    },
    thumbType?: 'clip' | 'thumb'
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
      thumbnailIndex: indx != null && indx >= 0 ? indx : undefined,
      thumbType
    })
    !editPreviewModalOpen && setEditPreviewModalOpen(true)
  }

  const handleUpdatePreview = (previewData: {
    imagePrev?: { previewUrl: string; defaultPrev: string }
    videoPrev?: { start: number; end: number; defaultPrev: string }
  }) => {
    const defaultPrev = previewData.imagePrev?.defaultPrev ?? previewData.videoPrev?.defaultPrev
    let indexToChange = progressInfosNew.val.findIndex(info => info.previewUrl === defaultPrev)
    const progressInfoChangeId = progressInfos.val.findIndex(info => info.previewUrl === defaultPrev)
    const oldVideo = data?.data?.videos?.find((video: any) => video?.url === defaultPrev)
    if (previewData.imagePrev) {
      setProgressInfosNew(
        produce(progressInfosNew, draft => {
          // if there is no video in newProgInfos then add it
          if (oldVideo && progressInfoChangeId !== -1 && indexToChange === -1) {
            indexToChange =
              draft.val.push({
                ...progressInfos.val[progressInfoChangeId],
                id: oldVideo.id
              }) - 1
          }

          draft.val[indexToChange].imagePreview = previewData.imagePrev?.previewUrl
          delete draft.val[indexToChange].trimPreview
        })
      )
      setProgressInfos(
        produce(progressInfos, draft => {
          if (oldVideo) draft.val[progressInfoChangeId].id = oldVideo.id
          draft.val[progressInfoChangeId].imagePreview = previewData.imagePrev?.previewUrl
          delete draft.val[progressInfoChangeId].trimPreview
        })
      )
      !postDirty && setPostDirty(true)
    }
    if (previewData.videoPrev) {
      setProgressInfosNew(
        produce(progressInfosNew, draft => {
          if (oldVideo && progressInfoChangeId !== -1 && indexToChange === -1) {
            indexToChange =
              draft.val.push({
                ...progressInfos.val[progressInfoChangeId],
                id: oldVideo.id
              }) - 1
          }
          draft.val[indexToChange].trimPreview = {
            start: previewData.videoPrev?.start ?? 0,
            end: previewData.videoPrev?.end ?? 10
          }
          delete draft.val[indexToChange].imagePreview
        })
      )
      setProgressInfos(
        produce(progressInfos, draft => {
          if (oldVideo) draft.val[progressInfoChangeId].id = oldVideo.id
          draft.val[progressInfoChangeId].trimPreview = {
            start: previewData.videoPrev?.start ?? 0,
            end: previewData.videoPrev?.end ?? 10
          }
          delete draft.val[progressInfoChangeId].imagePreview
        })
      )
      !postDirty && setPostDirty(true)
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
    setProgressInfosNew({ val: tmpArr })
    !postDirty && setPostDirty(true)
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
    setProgressInfosNew({ val: tmpArr })
    !postDirty && setPostDirty(true)
  }

  const findPaths = (progInfos: IProgressInfo[]) => (term: string) =>
    progInfos.filter((item: IProgressInfo) => {
      if (item.previewUrl.includes(term)) {
        return item
      }
    })

  const preparePost = (progInfos: IProgressInfo[]) => {
    const wherePath = findPaths(progInfos)
    const finishedPost = {
      body: post.body,
      photos: wherePath('/public/images').map((item: IProgressInfo) => {
        return {
          path: item.previewUrl,
          order: progressInfos.val.indexOf(item) + 1,
          orientation: item.orientation,
          locked: item.locked,
          text: item.text
        }
      }),
      videos: wherePath('/public/videos').map((item: IProgressInfo) => {
        if (item.id) {
          const sendData: { [key: string]: any } = {
            id: item.id
          }
          const progInfId = progressInfos.val.findIndex(progInf => progInf.previewUrl === item.previewUrl)
          if (item.imagePreview) sendData.active_thumbnail = item.imagePreview
          if (item.trimPreview)
            sendData.video_clip = {
              start: item.trimPreview.start,
              end: item.trimPreview.end
            }
          sendData.locked = item.locked
          sendData.preview = progressInfosNew.val[progInfId].previewOn
          if (item.orientation) sendData.orientation = item.orientation
          if (progInfId) sendData.order = progInfId + 1

          return sendData
        }
        return {
          path: item.previewUrl,
          order: progressInfos.val.indexOf(item) + 1,
          orientation: item.orientation,
          ...(item.duration && { duration: item.duration }),
          locked: item.locked,
          active_thumbnail: item.imagePreview || null,
          video_clip: item.trimPreview ? { start: item.trimPreview.start, end: item.trimPreview.end } : null,
          thumbnails: item.thumbnails,
          preview: item.previewOn
        }
      }),
      sounds: wherePath('/public/sound').map((item: any) => {
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
      shareOnTwitter: post.shareOnTwitter,
      media_to_delete: mediaToDelete,
      reorder
    }

    return finishedPost
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
              navigate('/')
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
          navigate('/')
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
              navigate('/')
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
          navigate('/')
        })
        .catch(goalRes => console.log(goalRes))
    }
  }

  const updatePhotosWithChangedText = () => {
    function standardizePhotos(photos: IProgressInfo[]) {
      return photos.map((item: IProgressInfo) => {
        return {
          id: item.id,
          text: item.text
        }
      })
    }
    const oldPhotos = standardizePhotos(data.data.photos).reduce((p: { [key: string]: any }, c) => {
      p[c.id] = c
      return p
    }, {})
    const newPhotos = standardizePhotos(findPaths(progressInfos.val)('/public/images'))
    const updates = newPhotos.reduce((p: AxiosPromise[], c, i) => {
      if (oldPhotos[c.id] && JSON.stringify(c) !== JSON.stringify(oldPhotos[c.id])) {
        p.push(editPhoto(c.id, { text: c.text }))
      }
      return p
    }, [])

    return updates
  }

  const submitPost = () => {
    if (pollData) {
      handlePollSubmit(pollData)
    } else if (goalData) {
      handleGoalSubmit(goalData)
    } else {
      const updatePromises = updatePhotosWithChangedText()
      const post = preparePost(progressInfosNew.val)

      if (
        !post.body &&
        post.photos.length === post.media_to_delete.photos.length &&
        post.videos.length === post.media_to_delete.videos.length &&
        !post.sounds
      ) {
        addToast('error', t('validation:postCannotBeEmpty'))
        return
      }
      if (post.price && !post.body && post.photos.length < 1 && post.videos.length < 1) {
        addToast('error', t('validation:premiumPostCannotBeAudioOnly'))
        return
      }

      post &&
        Promise.all([
          ...updatePromises,
          editPost(
            {
              ...post
            },
            postId
          )
        ])
          .then(() => {
            addToast('success', t('postCreatedSuccessfully'))
            // queryClient.invalidateQueries(['getSinglePost', postId]);
            navigate(`/profile/${userData.id}/all`)
          })
          .catch(err => {
            addToast('error', t('error:errorSomethingWentWrong'))
          })
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
          setText={(body: string, tags: ITag[]) => {
            setPost({ ...post, body, tags })
          }}
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
      title={editPreviewModalOpen ? t('editPreview') : t('editPost')}
      hideFooter={editPreviewModalOpen}
      handleGoBack={editPreviewModalOpen ? () => setEditPreviewModalOpen(false) : undefined}
    >
      {editPreviewModalOpen && videoPreviewData && (
        <EditPreviewModal
          defaultPreview={videoPreviewData.defaultPreview}
          storageSrc={videoPreviewData.storageSrc}
          thumbnails={videoPreviewData.thumbnails}
          thumbnailIndex={videoPreviewData.thumbnailIndex}
          trimPreview={videoPreviewData.trimPreview}
          thumbType={videoPreviewData.thumbType}
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
          setRecordedChunks={data => {
            setRecordedChunks(data)
          }}
          handleAudioStart={startRecording}
          handleAudioStop={stopRecording}
        />
      )}
      <div className={`newpost ${pollData || goalData ? 'newpost--pollPreview' : ''}`}>
        <PostVisibility
          isEdit={true}
          audience={postAudience}
          setAudience={(val: IGroup[]) => {
            setPostAudience(val)
          }}
        />

        <div className={`newpost__body`}>
          {renderContent()}
          {progressInfos.val.map((item: IProgressInfo, key: number) => {
            return (
              (item.type === 'sound' || item.type === 'audio') && (
                <AudioMessage
                  key={key}
                  customClass={`newpost__audiomessage ${audioOnly ? '' : 'newpost__audiomessage--active'}`}
                  audioBlob={item.previewUrl}
                  audioReady={progressInfos.val[key] && !!progressInfos.val[key].previewUrl}
                  waveColor='gray'
                  waveBackgroundColor='transparent'
                  processing={
                    progressInfos.val[key] &&
                    progressInfos.val[key].percentage > 0 &&
                    progressInfos.val[key].percentage < 100
                  }
                  percentage={progressInfos.val[key] && progressInfos.val[key].percentage}
                  uploadError={progressInfos.val[key] && progressInfos.val[key].error}
                  hasDeleteBtn={true}
                  deleteFn={() => {
                    // removeFile(item);
                    removeByUrl(item.previewUrl)
                    progressInfos.val[key] && progressInfos.val[key].cancel()
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
                <Swiper className='mediaSwiper' spaceBetween={8} slidesPerView='auto'>
                  {progressInfos.val.map((item: IProgressInfo, key: number) => {
                    if (item.type === 'photo') {
                      return (
                        <SwiperSlide key={key}>
                          <PostImage
                            isEdit={true}
                            // image={item}
                            id={key}
                            imagePreview={progressInfos.val[key] && progressInfos.val[key].previewUrl}
                            processing={progressInfos.val[key] && !progressInfos.val[key].previewUrl}
                            percentage={progressInfos.val[key] && progressInfos.val[key].percentage}
                            abortUploadCb={progressInfos.val[key] && progressInfos.val[key].cancel}
                            uploadError={progressInfos.val[key] && progressInfos.val[key].error}
                            previewUrl={progressInfos.val[key] && progressInfos.val[key].previewUrl}
                            locked={progressInfos.val[key] && progressInfos.val[key].locked}
                            isPremium={!!post.price}
                            removeFile={() => {
                              removeMedia(item)
                            }}
                            removeByUrl={url => removeByUrl(url)}
                            reorderActive={reorderActive}
                            reorderNumber={newOrder.indexOf(item)}
                            updateOrder={() => handleNewOrder(item)}
                            editPreview={() => {
                              modalContext.addModal(
                                '',
                                <PhotoEditView
                                  photo={{
                                    url: progressInfos.val[key].previewUrl,
                                    text: progressInfos.val[key].text
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
                                    let newKey: number
                                    if (
                                      progressInfosNew.val.find((p, i) => {
                                        if (p.previewUrl === progressInfos.val[key].previewUrl) {
                                          newKey = i
                                          return true
                                        }
                                        return false
                                      })
                                    ) {
                                      setProgressInfosNew(
                                        produce(progressInfosNew, draft => {
                                          draft.val[newKey].text = data.text
                                        })
                                      )
                                    }
                                    !postDirty && setPostDirty(true)
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
                            processing={progressInfos.val[key] && !progressInfos.val[key].previewUrl}
                            percentage={progressInfos.val[key] && progressInfos.val[key].percentage}
                            abortUploadCb={progressInfos.val[key] && progressInfos.val[key].cancel}
                            uploadError={progressInfos.val[key] && progressInfos.val[key].error}
                            previewUrl={progressInfos.val[key] && progressInfos.val[key].previewUrl}
                            imagePreview={progressInfos.val[key] && progressInfos.val[key].imagePreview}
                            locked={progressInfos.val[key] && progressInfos.val[key].locked}
                            isPremium={!!post.price}
                            removeFile={() => {
                              removeMedia(item)
                            }}
                            removeByUrl={url => removeByUrl(url)}
                            reorderActive={reorderActive}
                            reorderNumber={newOrder.indexOf(item)}
                            updateOrder={() => handleNewOrder(item)}
                            editPreview={() => {
                              if (progressInfos.val[key]) {
                                handleEditVideoPreview(
                                  progressInfos.val[key].previewUrl,
                                  progressInfos.val[key].storageUrl,
                                  progressInfos.val[key].orientation,
                                  progressInfos.val[key].thumbnails,
                                  progressInfos.val[key].imagePreview,
                                  progressInfos.val[key].trimPreview,
                                  progressInfos.val[key].thumbType
                                )
                              }
                            }}
                            trimmedVideo={progressInfos.val[key] && progressInfos.val[key].trimPreview}
                            previewOn={progressInfos.val[key] && progressInfos.val[key].previewOn}
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
            isUploading={false}
            price={post.price}
            hasCategories={!!selectedCategories.length}
            setPrice={(val: number) => {
              if (!!val) {
                const tmpInfo = progressInfos.val.map(info => {
                  return { ...info, locked: true }
                })
                setProgressInfos({ val: tmpInfo })
                setProgressInfosNew({ val: tmpInfo })
              }
              setPost({ ...post, price: val })
            }}
            submitPost={submitPost}
            postReady={(postReady && postDirty && !postEmpty) || !!pollData || !!goalData || !postEmpty}
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
    </BasicLayout>
  )
}

export default EditPost
