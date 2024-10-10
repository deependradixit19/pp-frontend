import { FC, useCallback, useEffect, useRef, useState } from 'react'
import './_preview.scss'

import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'

import 'swiper/css/bundle'

import { usePreviewContext } from '../../context/previewContext'
import { IconStatsClose } from '../../assets/svg/sprite'
import { useHomePostsFeed, useInfiniteFeed } from '../../helpers/hooks'
import { IPost } from '../../types/interfaces/ITypes'
import PreviewComments from './PreviewComments/PreviewComments'

import SinglePostPreview from './SinglePostPreview/SinglePostPreview'
import {
  getLikedHistoryFeed,
  getPlaylistFeed,
  getPurchasesFeed,
  getWatchedHistoryFeed
} from '../../services/endpoints/media'

const PreviewMedia: FC = () => {
  const [previewFeed, setPreviewFeed] = useState<IPost[]>([])
  const [showControls, setShowControls] = useState<boolean>(true)

  const swiper = useRef() as any
  const observer = useRef<IntersectionObserver>()

  const {
    userId,
    query,
    clearModal,
    selectedPost,
    selectedSlide,
    minimized,
    handleMinimize,
    updateSelectedPost,
    setCommentsActive,
    commentsActive,
    selectedPostData,
    setSelectedPostData,
    previewLocation
  } = usePreviewContext()

  const handleFetchDataByType = (type: string, params: any, page: number) => {
    if (type === 'purchased') {
      return getPurchasesFeed(params)
    }
    if (type === 'watched') {
      return getWatchedHistoryFeed(params)
    }
    if (type === 'playlist') {
      return getPlaylistFeed(params)
    }

    return getLikedHistoryFeed(params)
  }

  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteFeed(
    query,
    (params: any, page: number) => {
      return handleFetchDataByType(previewLocation, params, page)
    }
  )

  console.log({ selectedPost })
  console.log({ selectedPostData })

  useEffect(() => {
    if (data && !isFetching) {
      const tmp = data.pages.map(page => {
        return page.page.data.data
      })
      console.log({ tmp })
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
      {!!previewFeed.length && selectedPostData && selectedPost !== null && selectedSlide !== null && (
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
            console.log({ ctx })
            console.log(ctx.activeIndex)

            console.log({ currentPost })
            setSelectedPostData(currentPost)
          }}
          observer={true}
          noSwiping={!showControls || commentsActive || minimized}
          preventInteractionOnTransition={true}
        >
          {console.log({ previewFeed })}
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

export default PreviewMedia
