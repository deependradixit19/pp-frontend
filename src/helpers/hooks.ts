import {
  useState,
  useEffect,
  MutableRefObject,
  useMemo,
  useRef,
  useLayoutEffect,
  MouseEvent,
  TouchEvent,
  useCallback
} from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery, useMutation, UseMutationOptions, useQueryClient } from 'react-query'
import { useLocation } from 'react-router-dom'
import dayjs from 'dayjs'
import { addToast } from '../components/Common/Toast/Toast'
import { getNotifications, getUserActivity } from '../services/endpoints/api_notifications'
import { trimVideo } from '../services/endpoints/attachments'
import { getHomeFeed, getUsersFeedInfinite } from '../services/endpoints/feed'
import {
  answerPoll,
  deletePost,
  getPostCommentsInfinite,
  pinPost,
  postStorySeen,
  sendTipToPost
} from '../services/endpoints/posts'
import { apiFanProfileSession, postEngaged, postsImpression } from '../services/endpoints/tracking'
import { reportPost } from '../services/endpoints/report'
import { changeLinkedAccount } from '../services/endpoints/settings'
import { likeStory } from '../services/endpoints/story'
// import { getReportTypes } from '../services/endpoints/report';
import axiosInstance from '../services/http/axiosInstance'
import { setAccessToken } from '../services/storage/storage'
import { IFile } from '../types/interfaces/IFile'
import { IPreviewFile } from '../types/interfaces/IPreviewFile'
import {
  IComment,
  IInfiniteCommentsPage,
  IInfiniteNotifications,
  IInfinitePage,
  IPost,
  IPostMediaCounter,
  ITipPayload
} from '../types/interfaces/ITypes'
import { LikeableType, StoryActionType } from '../types/types'
import { orderMediaFiles } from './media'
import { useTrackingContext } from '../context/trackingContext'
import { useUserContext } from '../context/userContext'

export const useMediaCounters = (postData: IPost) => {
  const [counter, setCounter] = useState<IPostMediaCounter>({
    imgs: 0,
    img: 0,
    vids: 0,
    vid: 0
  })

  const [mediaFiles, setMediaFiles] = useState<IFile[]>([])
  const [previewFiles, setPreviewFiles] = useState<IPreviewFile[]>([])

  useEffect(() => {
    if (postData) {
      const { media, previews } = orderMediaFiles(postData)
      setMediaFiles(media)
      setPreviewFiles(previews)
    }
  }, [postData])
  useEffect(() => {
    if (mediaFiles?.length > 0) {
      if (mediaFiles[0].url.includes('/image')) {
        setCounter({
          imgs: postData.photos.length > 0 ? postData.photos.length : null,
          img: postData.photos.length > 0 ? 1 : null,
          vids: postData.videos.length > 0 ? postData.videos.length : null,
          vid: postData.videos.length > 0 ? 1 : null
        })
        // setActiveFile('img');
      } else {
        setCounter({
          imgs: postData.photos.length > 0 ? postData.photos.length : null,
          img: postData.photos.length > 0 ? 1 : null,
          vids: postData.videos.length > 0 ? postData.videos.length : null,
          vid: postData.videos.length > 0 ? 1 : null
        })
        // setActiveFile('vid');
      }
    } else {
      setCounter({
        imgs: postData.photos.length > 0 ? postData.photos.length : null,
        img: null,
        vids: postData.videos.length > 0 ? postData.videos.length : null,
        vid: null
      })
    }
  }, [mediaFiles, postData])
  useEffect(() => {
    if (previewFiles?.length > 0) {
      if (previewFiles[0].preview.src.includes('/image')) {
        setCounter({
          imgs: postData.photos_preview.length > 0 ? postData.photos_preview.length : null,
          img: postData.photos_preview.length > 0 ? 1 : null,
          vids: postData.videos_preview.length > 0 ? postData.videos_preview.length : null,
          vid: postData.videos_preview.length > 0 ? 1 : null
        })
        // setActiveFile('img');
      } else {
        setCounter({
          imgs: postData.photos_preview.length > 0 ? postData.photos_preview.length : null,
          img: postData.photos_preview.length > 0 ? 1 : null,
          vids: postData.videos_preview.length > 0 ? postData.videos_preview.length : null,
          vid: postData.videos_preview.length > 0 ? 1 : null
        })
        // setActiveFile('vid');
      }
    } else {
      setCounter({
        imgs: postData.photos_preview.length > 0 ? postData.photos_preview.length : null,
        img: null,
        vids: postData.videos_preview.length > 0 ? postData.videos_preview.length : null,
        vid: null
      })
    }
  }, [previewFiles, postData])

  const handleUpdateCounters = (key: number) => {
    if (mediaFiles[key].url.includes('/image')) {
      // setActiveFile('img');
      setCounter({
        ...counter,
        img: mediaFiles.filter((item: any) => item.url.includes('/image')).indexOf(mediaFiles[key]) + 1
      })
    } else {
      // setActiveFile('vid');
      setCounter({
        ...counter,
        vid: mediaFiles.filter((item: any) => item.url.includes('/video')).indexOf(mediaFiles[key]) + 1
      })
    }
  }
  const handleUpdatePreviewCounters = (key: number) => {
    if (previewFiles[key].preview.src.includes('/image')) {
      // setActiveFile('img');
      setCounter({
        ...counter,
        img:
          previewFiles.filter((item: IPreviewFile) => item.preview.src.includes('/image')).indexOf(previewFiles[key]) +
          1
      })
    } else {
      // setActiveFile('vid');
      setCounter({
        ...counter,
        vid:
          previewFiles.filter((item: IPreviewFile) => item.preview.src.includes('/video')).indexOf(previewFiles[key]) +
          1
      })
    }
  }

  return {
    counter,
    handleUpdateCounters,
    handleUpdatePreviewCounters
  }
}

export const useFilterQuery = () => {
  const { search } = useLocation()

  return useMemo(() => new URLSearchParams(search), [search])
}

export const useQueryParams = <T>() => {
  const { search } = useLocation()

  return useMemo<T>(() => Object.fromEntries(new URLSearchParams(search).entries()) as T, [search])
}

export const useDynamicHeight = (offset: number) => {
  const [wrapperStyle, setWrapperStyle] = useState<any>(null)
  useLayoutEffect(() => {
    const height = window.innerHeight - offset
    setWrapperStyle({ height: `${height / 10}rem` })
  }, [])

  return { wrapperStyle }
}

/**
 * Hook that alerts clicks outside of the passed ref
 */
function hasClass(elem: HTMLElement, cls: string) {
  var str = ' ' + elem.className + ' '
  var testCls = ' ' + cls + ' '
  return str.indexOf(testCls) !== -1
}

function closest(el: any, cls: string) {
  while (el && el !== document.body) {
    if (hasClass(el, cls)) return el
    el = el.parentNode
  }
  return null
}

export const useOutsideAlerter = (
  ref: MutableRefObject<HTMLElement | null>,
  cb: () => void,
  excludeClasses?: string[]
) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: Event) {
      const el = event.target as HTMLElement

      if (ref && ref.current && !ref.current.contains(event.target as Node)) {
        if (excludeClasses && !!excludeClasses.length) {
          const isSendButton = excludeClasses.some(excClass => closest(el, excClass))

          if (isSendButton) {
            return
          } else {
            cb()
          }
        } else {
          cb()
        }
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])
}

// Hook
// T is a generic type for value parameter, our case this will be string
export function useDebounce<T>(value: T, delay: number): T {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler)
      }
    },
    [value, delay] // Only re-call effect if value or delay changes
  )
  return debouncedValue
}

export function debounce<Params extends any[]>(
  func: (...args: Params) => any,
  timeout: number
): (...args: Params) => void {
  let timer: NodeJS.Timeout
  return (...args: Params) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, timeout)
  }
}

export const usePostsFeed = (userId: number | undefined, filter: {}) => {
  // console.log({ filter });
  return useInfiniteQuery<IInfinitePage, Error>(
    ['getFeed', userId, filter],
    ({ pageParam = 1 }) => {
      return getUsersFeedInfinite(userId, { ...filter, page: pageParam })
    },
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.nextCursor
      },
      refetchOnWindowFocus: false,
      enabled: !!userId && filter && !!Object.keys(filter).length
    }
  )
  // const {
  //   data,
  //   error,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetching,
  //   isFetchingNextPage,
  //   isRefetching,
  //   status,
  // } = useInfiniteQuery<IInfinitePage, Error>(
  //   ['getFeed', userId, filter],
  //   ({ pageParam = 1 }) =>
  //     getUsersFeedInfinite(userId, { ...filter, page: pageParam }),
  //   {
  //     getNextPageParam: (lastPage, pages) => {
  //       return lastPage.nextCursor;
  //     },
  //     refetchOnWindowFocus: false,
  //     enabled: !!userId && !!Object.keys(filter).length,
  //   }
  // );

  // return {
  //   data,
  //   error,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetching,
  //   isFetchingNextPage,
  //   isRefetching,
  //   status,
  // };
}
export const useHomePostsFeed = (params: any) => {
  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery<
    IInfinitePage,
    Error
  >(['getHomeFeed', params.list], ({ pageParam = 1 }) => getHomeFeed(params, pageParam), {
    getNextPageParam: (lastPage, pages) => {
      return lastPage.nextCursor
    },
    refetchOnWindowFocus: false,
    enabled: !!params.list
  })

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status
  }
}

export const useDeletePost = (options = {}) => {
  const deletePostMutation = useMutation(async (postId: number) => await deletePost(postId), options)

  return { deletePostMutation }
}

export const useLikePost = (
  postId: number,
  onMutateCb?: () => void,
  onErrorCb?: (err?: any, context?: any) => void,
  onSettledCb?: () => void,
  onSuccessCb?: () => void
) => {
  const likePost = useMutation(
    async () => {
      await axiosInstance({
        method: 'post',
        url: `/api/like/post/${postId}`
      })
    },
    {
      onMutate: () => {
        onMutateCb && onMutateCb()
      },
      onError: () => {
        onErrorCb && onErrorCb()
      },
      onSettled: () => {
        onSettledCb && onSettledCb()
      },
      onSuccess: () => {
        onSuccessCb && onSuccessCb()
      }
    }
  )

  return { likePost }
}

export const useLiking = (
  likeableId: number,
  likeableType: LikeableType,
  onMutateCb?: () => void,
  onErrorCb?: (error: any) => void,
  onSuccessCb?: (data: any) => void,
  onSettledCb?: () => void
) => {
  const like = useMutation(
    async () => {
      await axiosInstance({
        method: 'post',
        url: `/api/like/${likeableType}/${likeableId}`
      })
    },
    {
      onSuccess: data => {
        onSuccessCb && onSuccessCb(data)
      },
      onMutate: () => {
        onMutateCb && onMutateCb()
      },
      onError: error => {
        onErrorCb && onErrorCb(error)
      },
      onSettled: () => {
        onSettledCb && onSettledCb()
      }
    }
  )

  return { like }
}

export const useTipPost = (options: { onMutate: (val: number) => void; onError?: () => void }) => {
  const setPostTip = useMutation(async (variables: ITipPayload) => await sendTipToPost(variables), {
    onMutate: variables => options.onMutate(parseInt(variables.amount))
  })

  return { setPostTip }
}
export const usePinPost = (options: {}) => {
  const pin = useMutation(async (postId: number) => await pinPost(postId), options)

  return { pin }
}
export const useAnswerPoll = (
  // pollId: number | undefined,
  options: {
    onMutate?: () => void
    onError?: () => void
    onSettled?: () => void
  }
) => {
  const setPollAnswer = useMutation(
    async (variables: { pollId: number; answer?: string | number | null; answerId?: number }) =>
      await answerPoll(variables),
    options
  )

  return { setPollAnswer }
}
export const useTrimVideo = (
  // trimData: { video: string; start: number; end: number },
  options: {
    onMutate?: () => void
    onError?: () => void
    onSettled?: (res: any) => void
  }
) => {
  const trim = useMutation(
    async (trimData: { video: string; start: number; end: number }) => await trimVideo(trimData),
    options
  )
  return { trim }
}

export const useCommentsInfinite = (
  postId: number,
  initialComments: IComment[],
  fetchCommentsEnabled: boolean = false
) => {
  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery<
    IInfiniteCommentsPage,
    Error
  >(['commentsForPost', postId], ({ pageParam }) => getPostCommentsInfinite(postId, pageParam), {
    getNextPageParam: (lastPage, pages) => {
      return lastPage.nextCursor
    },
    refetchOnWindowFocus: false,
    enabled: fetchCommentsEnabled,
    initialData: {
      pageParams: [],
      pages: [
        {
          nextCursor: 1,
          page: {
            data: {
              data: initialComments
            }
          }
        }
      ]
    }
  })

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status
  }
}

export const useDeleteComment = (options = {}) => {
  const deleteComment = useMutation(async (data: { commentId: number; parentId: number; isReply: boolean }) => {
    await axiosInstance({
      method: 'delete',
      url: `/api/comment/${data.commentId}`
    })
  }, options)

  return { deleteComment }
}

export const useReportComment = (options = {}) => {
  const reportComment = useMutation(async (data: { commentId: number; message: string; reportType: number }) => {
    await axiosInstance({
      method: 'post',
      url: `/api/report/comment/${data.commentId}`,
      data: {
        message: data.message,
        report_type_id: data.reportType
      }
    })
  }, options)

  return { reportComment }
}
export const useReportPost = (options = {}) => {
  const reportPostMutation = useMutation(
    async (variables: { postId: number; message: string; reportType: number }) =>
      reportPost(variables.postId, variables.message, variables.reportType),
    options
  )

  return { reportPostMutation }
}
export const useStorySeen = (options = {}) => {
  const storySeenMutation = useMutation(
    async (variables: { storyId: number }) => postStorySeen(variables.storyId),
    options
  )

  return { storySeenMutation }
}
export const useStoryLike = (options = {}) => {
  const storyLikeMutation = useMutation(async (variables: { storyId: number }) => likeStory(variables.storyId), options)

  return { storyLikeMutation }
}
export const useChangeAccount = (options: {}) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const changeAccount = useMutation((linkedId: {}) => changeLinkedAccount(linkedId), {
    onSuccess: function (data) {
      // console.log('from success', data);
      setAccessToken(data.token)
      queryClient.invalidateQueries('linkedAccounts')
      queryClient.invalidateQueries('loggedProfile')
      queryClient.invalidateQueries('profile')
      addToast('success', t('accountSuccessfullyChanged'))
    },
    onError: function (data) {
      console.log(data)
      addToast('error', t('error:errorSomethingWentWrong'))
    }
  })
  return { changeAccount }
}
export const useAutoplay = (options: {}) => {
  const autoplay = useMutation(async (variables: { prevState: boolean }) => {
    await axiosInstance({
      method: 'post',
      url: `/api/user/autoplay`
    })
  }, options)

  return { autoplay }
}

export const usePreviousState = (value: any) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export const useNotificationsFeedInfinite = (filter: string) => {
  const { data, error, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, status } = useInfiniteQuery<
    IInfiniteNotifications,
    Error
  >(['notifications', filter], ({ pageParam = 1 }) => getNotifications(pageParam, filter), {
    getNextPageParam: (lastPage, pages) => {
      return lastPage.nextCursor
    },
    enabled: true,
    keepPreviousData: true,
    refetchOnWindowFocus: false
  })

  return {
    data,
    error,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    status
  }
}

export const useEventDefiner = ({
  onClick,
  onSwipeLeft,
  onSwiperight,
  onLongPressStart,
  onLongPressEnd
}: {
  onClick?: () => any
  onSwipeLeft?: () => any
  onSwiperight?: () => any
  onLongPressStart?: () => any
  onLongPressEnd?: () => any
}) => {
  const [action, setAction] = useState<StoryActionType>('click')

  const actionOriginRef = useRef<'mouse' | 'touch' | ''>('')

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const isAboveClickThreshold = useRef<boolean>(false)
  const mouseInitialPositionRef = useRef<{ x: number; y: number }>({
    x: 0,
    y: 0
  })

  function startPressTimer() {
    timerRef.current = setTimeout(() => {
      isAboveClickThreshold.current = true
    }, 700)
  }

  function initializeMouseLocation(event: MouseEvent | TouchEvent): {
    x: number
    y: number
  } {
    let tempMousePosition = { x: 0, y: 0 }

    if (event.type === 'mousedown' || event.type === 'mouseup') {
      event = event as MouseEvent
      tempMousePosition = { x: event.clientX, y: event.clientY }
    } else if (event.type === 'touchstart') {
      event = event as TouchEvent
      tempMousePosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      }
    } else if (event.type === 'touchend') {
      event = event as TouchEvent
      tempMousePosition = {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY
      }
    }
    return tempMousePosition
  }

  function handleOnMouseDown(event: MouseEvent | TouchEvent) {
    if (timerRef.current !== null) return
    mouseInitialPositionRef.current = initializeMouseLocation(event)
    onLongPressStart && onLongPressStart()
    startPressTimer()
  }

  function handleOnMouseUp(event: MouseEvent | TouchEvent) {
    const tempEndMousePosition = initializeMouseLocation(event)
    const mousePositionDiff = mouseInitialPositionRef.current.x - tempEndMousePosition.x
    if (!isAboveClickThreshold.current) {
      if (mousePositionDiff > 40) {
        setAction('swipeRight')
        onSwiperight && onSwiperight()
      } else if (mousePositionDiff < -40) {
        setAction('swipeLeft')
        onSwipeLeft && onSwipeLeft()
      } else {
        setAction('click')
        onClick && onClick()
      }
    } else {
      setAction('longPress')
      onLongPressEnd && onLongPressEnd()
    }
    isAboveClickThreshold.current = false
    if (timerRef.current === null) return
    clearTimeout(timerRef.current)
    timerRef.current = null
  }

  return {
    action,
    handlers: {
      // onClick: handleOnClick,
      onMouseDown: (event: MouseEvent) => {
        actionOriginRef.current = actionOriginRef.current === '' ? 'mouse' : actionOriginRef.current
        actionOriginRef.current === 'mouse' && handleOnMouseDown(event)
      },
      onMouseUp: (event: MouseEvent) => {
        actionOriginRef.current === 'mouse' && handleOnMouseUp(event)
      },
      onTouchStart: (event: TouchEvent) => {
        actionOriginRef.current = 'touch'
        actionOriginRef.current === 'touch' && handleOnMouseDown(event)
      },
      onTouchEnd: (event: TouchEvent) => {
        actionOriginRef.current === 'touch' && handleOnMouseUp(event)
      },
      onContextMenu: (event: MouseEvent) => event.preventDefault()
    }
  }
}

export const useInfiniteFeed = (queryParams: [string, any], fetchFn: (...args: any[]) => Promise<IInfinitePage>) => {
  // console.log({ queryParams });
  // console.log(queryParams[1]);
  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery<
    IInfinitePage,
    Error
  >(
    queryParams,
    ({ pageParam = 1 }) => {
      // fetchFn({ params: queryParams[1], currentPage: pageParam }),
      // console.log({ queryParams });
      return fetchFn({ ...queryParams[1], page: pageParam })
    },
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.nextCursor
      },
      refetchOnWindowFocus: false,
      enabled: !!queryParams && !!queryParams.length
    }
  )

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status
  }
}
export const useGetMonthName = () => {
  const { t } = useTranslation()

  const getMonthName = (dateIndex: number, type: 'full' | 'shorthand' = 'full') => {
    switch (dateIndex) {
      case 0:
        if (type === 'full') {
          return t('january')
        } else {
          return t('jan')
        }
      case 1:
        if (type === 'full') {
          return t('february')
        } else {
          return t('feb')
        }
      case 2:
        if (type === 'full') {
          return t('march')
        } else {
          return t('mar')
        }
      case 3:
        if (type === 'full') {
          return t('april')
        } else {
          return t('apr')
        }
      case 4:
        if (type === 'full') {
          return t('mayFull')
        } else {
          return t('may')
        }
      case 5:
        if (type === 'full') {
          return t('june')
        } else {
          return t('jun')
        }
      case 6:
        if (type === 'full') {
          return t('july')
        } else {
          return t('Jul')
        }
      case 7:
        if (type === 'full') {
          return t('august')
        } else {
          return t('aug')
        }
      case 8:
        if (type === 'full') {
          return t('september')
        } else {
          return t('sept')
        }
      case 9:
        if (type === 'full') {
          return t('october')
        } else {
          return t('oct')
        }
      case 10:
        if (type === 'full') {
          return t('november')
        } else {
          return t('nov')
        }
      case 11:
        if (type === 'full') {
          return t('december')
        } else {
          return t('dec')
        }

      default:
        if (type === 'full') {
          return t('january')
        } else {
          return t('januaryShorthand')
        }
    }
  }

  return {
    getMonthName: (dateIndex: number, type: 'full' | 'shorthand') => getMonthName(dateIndex, type)
  }
}

export const useWeekday = () => {
  const { t } = useTranslation()

  const getWeekday = (weekdayIndex: number, type: 'full' | 'shorthand' = 'full') => {
    switch (weekdayIndex) {
      case 0:
        if (type === 'full') {
          return t('monday')
        } else {
          return t('mondayShorthand')
        }
      case 1:
        if (type === 'full') {
          return t('tuesday')
        } else {
          return t('tuesdayShorthand')
        }
      case 2:
        if (type === 'full') {
          return t('wednesday')
        } else {
          return t('wednesdayShorthand')
        }
      case 3:
        if (type === 'full') {
          return t('thursday')
        } else {
          return t('thursdayShorthand')
        }
      case 4:
        if (type === 'full') {
          return t('friday')
        } else {
          return t('fridayShorthand')
        }
      case 5:
        if (type === 'full') {
          return t('saturday')
        } else {
          return t('saturdayShorthand')
        }
      case 6:
        if (type === 'full') {
          return t('sunday')
        } else {
          return t('sundayShorthand')
        }
      default:
        if (type === 'full') {
          return t('monday')
        } else {
          return t('mondayShorthand')
        }
    }
  }

  return {
    getWeekday: (weekdayIndex: number, type: 'full' | 'shorthand') => getWeekday(weekdayIndex, type)
  }
}

export const useEngagePost = (
  postId?: number | undefined,
  wasEngaged: boolean | undefined = false,
  mutationOptions?: UseMutationOptions<unknown, unknown, number, unknown>
) => {
  const { mutateAsync } = useMutation((id: number) => postEngaged(id), mutationOptions)

  const engagePost = useCallback(
    (id?: number, engaged?: boolean) => {
      const onePostId = id ?? postId
      if (!(engaged ?? wasEngaged) && onePostId) {
        mutateAsync(onePostId)
      }
    },
    [wasEngaged, mutateAsync, postId]
  )

  const ret = useMemo(
    () => ({
      engagePost
    }),
    [engagePost]
  )

  return ret
}

// Convert state (or any other reactive...) to ref and update on state change
// similar purpose to upcoming react useEvent when used in useEffect
// (will behave like it isn't in dependencies cause it won't change troughout the lifecycle of component)
export const useSelfUpdatingRef = <T>(reactive: T) => {
  const ref = useRef<T>(reactive)

  useLayoutEffect(() => {
    ref.current = reactive
  }, [reactive])

  return ref
}

export const useImpressionsTracker = (clearContextOnUnmount = false, debounceMs = 2000) => {
  const impressionQueue = useRef<number[]>([])
  const { addImpressionId, hasImpressionId, clearImpressionIds } = useTrackingContext()

  const clearImpressionIdsRef = useSelfUpdatingRef(clearImpressionIds)
  const addImpressionIdRef = useSelfUpdatingRef(addImpressionId)
  const hasImpressionIdRef = useSelfUpdatingRef(hasImpressionId)
  const shouldClearContextRef = useSelfUpdatingRef(clearContextOnUnmount)

  const commitImpressions = useRef(() => {
    if (impressionQueue.current.length > 0) {
      postsImpression(impressionQueue.current)
      impressionQueue.current = []
    }
  })

  const debounceImpressions = useRef(
    debounce(() => {
      commitImpressions.current()
    }, debounceMs)
  )

  const addDebounceImpression = useCallback(
    (postId: number, shouldFire: boolean = true) => {
      if (shouldFire && !hasImpressionIdRef.current(postId)) {
        addImpressionIdRef.current?.(postId)
        impressionQueue.current.push(postId)
        debounceImpressions.current()
      }
    },
    [addImpressionIdRef, hasImpressionIdRef]
  )

  useEffect(() => {
    const onUnload = (e: Event) => {
      // console.log('onUnload', e.type);
      if (e.type === 'visibilitychange' && document.visibilityState === 'hidden') {
        commitImpressions.current()
      } else {
        commitImpressions.current()
      }
    }
    ;['visibilitychange', 'beforeunload'].forEach(evName => {
      window.addEventListener(evName, onUnload)
    })
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      commitImpressions.current()
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (shouldClearContextRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        clearImpressionIdsRef.current()
      }
      ;['visibilitychange', 'beforeunload'].forEach(evName => {
        window.removeEventListener(evName, onUnload)
      })
    }
  }, [clearImpressionIdsRef, shouldClearContextRef])

  const ret = useMemo(
    () => ({
      addDebounceImpression
    }),
    [addDebounceImpression]
  )

  return ret
}

export const useVideoPlayedTracking = (
  trackPlayed: boolean = false,
  url: string,
  videoId: number | undefined,
  videoUserId: number | undefined
) => {
  const { addOrEditQueuedPlayedS, sendQueuedPlayedS } = useTrackingContext()

  const addOrEditQueuedPlayedSRef = useSelfUpdatingRef(addOrEditQueuedPlayedS)
  const sendQueuedPlayedSRef = useSelfUpdatingRef(sendQueuedPlayedS)

  const userData = useUserContext()
  const durationSentRef = useRef(false)
  const maxPlayedSRef = useRef(0)
  const trackPlayedSRef = useSelfUpdatingRef(trackPlayed)
  const queueAndDelaySend = useCallback(() => {
    if (
      trackPlayedSRef.current &&
      !durationSentRef.current &&
      videoId &&
      videoUserId &&
      videoUserId !== userData?.id &&
      maxPlayedSRef.current
    ) {
      durationSentRef.current = true
      addOrEditQueuedPlayedSRef.current({
        video_id: videoId,
        duration: maxPlayedSRef.current
      })
    }
  }, [userData?.id, videoId, videoUserId, durationSentRef, trackPlayedSRef, maxPlayedSRef, addOrEditQueuedPlayedSRef])
  const queueAndDelaySendRef = useSelfUpdatingRef(queueAndDelaySend)
  const updateMaxPlayedS = useCallback((playedSeconds: number) => {
    if (playedSeconds > maxPlayedSRef.current) {
      maxPlayedSRef.current = playedSeconds
    }
  }, [])

  // video element should log video final pos on video url switch, video unmount and window exit
  useEffect(() => {
    durationSentRef.current = false

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      queueAndDelaySendRef.current()
    }
  }, [url, queueAndDelaySendRef])

  useEffect(() => {
    const onUnload = (e: Event) => {
      if (e.type === 'visibilitychange' && document.visibilityState === 'hidden') {
        sendQueuedPlayedSRef.current()
      } else {
        sendQueuedPlayedSRef.current()
      }
    }
    ;['visibilitychange', 'beforeunload'].forEach(evName => {
      window.addEventListener(evName, onUnload)
    })

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      queueAndDelaySendRef.current()
      ;['visibilitychange', 'beforeunload'].forEach(evName => {
        window.removeEventListener(evName, onUnload)
      })
    }
  }, [queueAndDelaySendRef, sendQueuedPlayedSRef])

  const ret = useMemo(
    () => ({
      updateMaxPlayedS
    }),
    [updateMaxPlayedS]
  )

  return ret
}

export const useProfileFanSessionTracking = (profileId: number) => {
  const userData = useUserContext()
  const profileAndUserId = useMemo(
    () => ({
      profileId,
      userId: userData?.id
    }),
    [profileId, userData?.id]
  )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const startTime = useMemo(() => dayjs(), [profileAndUserId])
  const durationSentRef = useRef(false)

  const sendDuration = useCallback(() => {
    if (profileId && userData?.id && profileId !== userData.id) {
      const duration = dayjs().diff(startTime, 'second', true)
      apiFanProfileSession(profileId, duration)
    }
  }, [profileId, userData?.id, startTime])
  const sendDurationRef = useSelfUpdatingRef(sendDuration)

  useEffect(() => {
    if (profileAndUserId.userId > 0 && profileAndUserId.profileId > 0) {
      durationSentRef.current = false
    }
    return () => {
      if (!durationSentRef.current && profileAndUserId.userId > 0 && profileAndUserId.profileId > 0) {
        durationSentRef.current = true
        sendDurationRef.current()
      }
    }
  }, [profileAndUserId, sendDurationRef])

  useEffect(() => {
    const onUnload = (e: Event) => {
      if (e.type === 'visibilitychange' && document.visibilityState === 'hidden') {
        if (!durationSentRef.current) {
          durationSentRef.current = true
          sendDurationRef.current()
        }
      } else {
        if (!durationSentRef.current) {
          durationSentRef.current = true
          sendDurationRef.current()
        }
      }
    }
    ;['visibilitychange', 'beforeunload'].forEach(evName => {
      window.addEventListener(evName, onUnload)
    })

    return () => {
      ;['visibilitychange', 'beforeunload'].forEach(evName => {
        window.removeEventListener(evName, onUnload)
      })
    }
  }, [sendDurationRef])
}

export const useUserActivityFeedInfinite = (filter: { type?: string; userId: number }) => {
  const { data, error, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, status } = useInfiniteQuery<
    IInfiniteNotifications,
    Error
  >(['notifications', filter], ({ pageParam = 1 }) => getUserActivity(pageParam, filter), {
    getNextPageParam: (lastPage, pages) => {
      return lastPage.nextCursor
    },
    enabled: true,
    keepPreviousData: true,
    refetchOnWindowFocus: false
  })

  return {
    data,
    error,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    status
  }
}
