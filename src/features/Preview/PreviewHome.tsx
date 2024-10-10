import { FC, useCallback, useEffect, useRef, useState } from 'react'
import './_preview.scss'

import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'

import 'swiper/css/bundle'

import { useQueryClient } from 'react-query'
import { usePreviewContext } from '../../context/previewContext'
import { IconStatsClose } from '../../assets/svg/sprite'
import { useEngagePost, useHomePostsFeed, useImpressionsTracker, useSelfUpdatingRef } from '../../helpers/hooks'
import { IPost } from '../../types/interfaces/ITypes'
import PreviewComments from './PreviewComments/PreviewComments'

import SinglePostPreview from './SinglePostPreview/SinglePostPreview'
import { pagedPostEngageMutationOptions } from '../../helpers/mutationOptions'
import { useUserContext } from '../../context/userContext'
import { apiViewPost } from '../../services/endpoints/tracking'

const PreviewHome: FC = () => {
  const [previewFeed, setPreviewFeed] = useState<IPost[]>([])
  const [showControls, setShowControls] = useState<boolean>(true)

  const swiper = useRef() as any
  const observer = useRef<IntersectionObserver>()
  const userData = useUserContext()

  const {
    userId,
    query,
    filterQuery,
    clearModal,
    selectedPost,
    selectedSlide,
    minimized,
    handleMinimize,
    updateSelectedPost,
    setCommentsActive,
    commentsActive,
    selectedPostData,
    setSelectedPostData
  } = usePreviewContext()

  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useHomePostsFeed({
    ...filterQuery,
    list: filterQuery.listId
  })

  const queryClient = useQueryClient()
  const { engagePost } = useEngagePost(undefined, undefined, pagedPostEngageMutationOptions(queryClient, query))
  const { addDebounceImpression } = useImpressionsTracker()
  const addDebounceImpressionRef = useSelfUpdatingRef(addDebounceImpression)
  const setSelectedPostDataRef = useSelfUpdatingRef(setSelectedPostData)

  // view and impression
  useEffect(() => {
    if (selectedPostData?.id && selectedPostData?.user_id && userData?.id) {
      apiViewPost(selectedPostData.id, selectedPostData.user_id !== userData?.id)
      addDebounceImpressionRef.current(selectedPostData.id, selectedPostData.user_id !== userData?.id)
    }
  }, [addDebounceImpressionRef, setSelectedPostDataRef, selectedPostData?.id, selectedPostData?.user_id, userData?.id])

  // engage
  useEffect(() => {
    if (selectedPostData?.id && !selectedPostData?.is_engage) {
      engagePost(selectedPostData.id, selectedPostData.is_engage)
      setSelectedPostDataRef.current({
        ...selectedPostData,
        is_engage: true
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engagePost, selectedPostData?.id, selectedPostData?.is_engage])

  useEffect(() => {
    if (data && !isFetching) {
      const tmp = data.pages.map(page => {
        return page.page.data.data
      })
      setPreviewFeed([...tmp.flat()])
    }
  }, [data, isFetching])

  useEffect(() => {
    if (selectedPost !== null) {
      swiper.current?.swiper.slideTo(selectedPost, 0, false)
    }
  }, [selectedPost])

  const lastPostRef = useCallback(
    (node: any) => {
      if (isFetchingNextPage) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage()
          }
        },
        { rootMargin: '1500px' }
      )

      if (node) observer.current.observe(node)
    },
    [isFetchingNextPage, hasNextPage]
  )

  if (error) {
    console.log(error)
  }
  status === 'error' && <p>Error: {error?.message}</p>

  // if (!deviceOrientation) return null;

  return (
    <div className='preview__wrapper'>
      <div
        className='preview__close'
        onClick={() => {
          clearModal()
        }}
      >
        {minimized ? <IconStatsClose color='#A3A3A3' /> : <IconStatsClose />}
      </div>
      {selectedPost !== null && selectedSlide !== null && (
        <Swiper
          onInit={(core: SwiperCore) => {
            swiper.current = core.el
          }}
          initialSlide={selectedPost}
          style={{ width: '100%', height: '100%' }}
          className='mySwiper'
          direction={'vertical'}
          speed={700}
          pagination={false}
          onSlideChangeTransitionStart={() => !showControls && setShowControls(true)}
          onSlideChange={(ctx: any) => {
            const currentPost = previewFeed[ctx.activeIndex]
            setSelectedPostData(currentPost)
          }}
          observer={true}
          noSwiping={!showControls || commentsActive || minimized}
          preventInteractionOnTransition={true}
        >
          {previewFeed.map((post, idx) => {
            if (previewFeed.length === idx + 1) {
              return (
                <SwiperSlide key={idx} className={`${!showControls || minimized ? 'swiper-no-swiping' : ''}`}>
                  <div ref={lastPostRef}>
                    <SinglePostPreview
                      post={post}
                      showControls={showControls}
                      minimizeFn={(fileIndex: number, type: string) => {
                        updateSelectedPost(idx, fileIndex, type, post)
                        if (minimized) {
                          !showControls && setShowControls(true)
                        }
                        handleMinimize(!minimized)
                      }}
                      toggleControls={() => setShowControls((showControls: boolean) => !showControls)}
                      isFirstPost={idx === 0}
                      hasNextPage={!!hasNextPage}
                      isInViewport={post.id === selectedPostData.id}
                    />
                  </div>
                </SwiperSlide>
              )
            } else {
              return (
                <SwiperSlide key={idx} className={`${!showControls || minimized ? 'swiper-no-swiping' : ''}`}>
                  <SinglePostPreview
                    post={post}
                    showControls={showControls}
                    minimizeFn={(fileIndex: number, type: string) => {
                      updateSelectedPost(idx, fileIndex, type, post)
                      if (minimized) {
                        !showControls && setShowControls(true)
                      }
                      handleMinimize(!minimized)
                    }}
                    toggleControls={() => setShowControls((showControls: boolean) => !showControls)}
                    isFirstPost={idx === 0}
                    hasNextPage={!!hasNextPage}
                    isInViewport={post.id === selectedPostData.id}
                  />
                </SwiperSlide>
              )
            }
          })}
        </Swiper>
      )}
      {selectedPostData && (
        <PreviewComments
          commentsActive={commentsActive}
          setCommentsActive={setCommentsActive}
          activeCommentsPostId={selectedPostData?.id}
          initialComments={selectedPostData['last_3_comments']}
          commentCount={selectedPostData?.comment_count}
          isMyPost={userId === selectedPostData.user?.id}
        />
      )}
    </div>
  )
}

export default PreviewHome