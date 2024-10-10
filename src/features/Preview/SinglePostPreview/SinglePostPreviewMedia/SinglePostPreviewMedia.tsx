import { FC, useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Zoom } from 'swiper/modules'
import { Swiper as SwiperClass } from 'swiper'

// Import Swiper styles
import 'swiper/css/bundle'
import ShowMore from '../../../../components/Common/ShowMore/ShowMore'
import { someTimeAgo } from '../../../../lib/dayjs'
import { IPost } from '../../../../types/interfaces/ITypes'
import { MinimizeIcon } from '../../Preview'
import PreviewActions from '../../PreviewActions/PreviewActions'
import styles from './singlePostPreview.module.scss'
import placeholderAvatar from '../../../../assets/images/user_placeholder.png'
import { IFile } from '../../../../types/interfaces/IFile'
import SinglePostPreviewImage from './components/SinglePostPreviewImage/SinglePostPreviewImage'
import SinglePostPreviewVideo from './components/SinglePostPreviewVideo/SinglePostPreviewVideo'
import SinglePostPreviewAudio from './components/SinglePostPreviewAudio/SinglePostPreviewAudio'
import { usePreviewContext } from '../../../../context/previewContext'
import { extractMedia } from '../../../../helpers/media'

interface Props {
  post: IPost
  showControls: boolean
  isFirstPost: boolean
  hasNextPage: boolean
  minimizeFn: (fileIndex: number, type: string) => void
  toggleControls: () => void
}

const SinglePostPreviewMedia: FC<Props> = ({
  post,
  showControls,
  isFirstPost,
  hasNextPage,
  minimizeFn,
  toggleControls
}) => {
  const [activeSlide, setActiveSlide] = useState<number | null>(null)

  const { userId, query, selectedSlide, minimized, setCommentsActive } = usePreviewContext()

  const postFile = {
    userId: post.user_id,
    name: post.user?.display_name,
    text: post.body,
    mentions: post.tags,
    media: extractMedia(post),
    minimizedName: post.user?.display_name,
    minimizedAvatar: post.user?.cropped_avatar?.url ?? post.user?.avatar?.url ?? placeholderAvatar
  }

  useEffect(() => {
    selectedSlide !== null && setActiveSlide(selectedSlide)
  }, [selectedSlide])

  return (
    <div className='preview__file--wrapper'>
      <Swiper
        // onInit={(core: SwiperCore) => {
        //   innerSwiper.current = core.el;
        // }}
        initialSlide={selectedSlide}
        style={{ width: '100%', height: '100%' }}
        className='myInnerSwiper'
        pagination={{
          dynamicBullets: true
        }}
        zoom={true}
        modules={[Zoom, Pagination]}
        observer={true}
        preventInteractionOnTransition={true}
        onSlideChange={(swiper: SwiperClass) => {
          setActiveSlide(swiper.activeIndex)
        }}
      >
        {postFile.media.map((item: IFile, index: number) => {
          if (item.url.includes('/images/originals')) {
            return (
              <div style={{ border: '1px solid red' }}>
                <SwiperSlide key={index} className={`${!showControls || minimized ? 'swiper-no-swiping' : ''}`}>
                  <MinimizeIcon {...{ minimized, post, showControls }} onClick={() => minimizeFn(index, 'photo')} />
                  {showControls && !minimized && (
                    <>
                      <ShowMore
                        // minimize={minimizeFn(index, 'photo')}
                        userId={postFile.userId}
                        name={postFile.name}
                        time={someTimeAgo(post.created_at)}
                        tags={['#bowieblue', '#bluechowchow']}
                        text={postFile.text ? postFile.text : ''}
                        mentions={postFile.mentions}
                      />
                      <PreviewActions
                        stats={{
                          overallRevenue: post.overall_revenue,
                          purchasesCount: post.purchases_count,
                          purchasesSum: post.purchases_sum,
                          tipsCount: post.tips_count,
                          tipsSum: post.tips_sum,
                          conversionRate: post.conversion_rate,
                          uniqueImpressions: post.unique_impressions,
                          views: post.views,
                          uniqueViews: post.unique_views
                        }}
                        query={query}
                        postId={post.id}
                        isMyPost={userId === post.user?.id}
                        isLiked={post.isLiked}
                        likes={post.likes_count}
                        comments={post.comment_count}
                        setCommentsActive={setCommentsActive}
                      />
                    </>
                  )}
                  <SinglePostPreviewImage
                    mediaItem={item}
                    postFile={postFile}
                    minimized={minimized}
                    isFirstPost={isFirstPost}
                    toggleControls={toggleControls}
                  />
                </SwiperSlide>
              </div>
            )
          } else if (item.url.includes('/videos/originals')) {
            return (
              <SwiperSlide key={index} className={`${!showControls || minimized ? 'swiper-no-swiping' : ''}`}>
                <MinimizeIcon {...{ minimized, post, showControls }} onClick={() => minimizeFn(index, 'video')} />
                {showControls && !minimized && (
                  <>
                    <ShowMore
                      userId={postFile.userId}
                      name={postFile.name}
                      time={someTimeAgo(post.created_at)}
                      tags={['#bowieblue', '#bluechowchow']}
                      text={postFile.text ? postFile.text : ''}
                      mentions={postFile.mentions}
                    />
                    <PreviewActions
                      // userId={userId}
                      // filter={filter}
                      stats={{
                        overallRevenue: post.overall_revenue,
                        purchasesCount: post.purchases_count,
                        purchasesSum: post.purchases_sum,
                        tipsCount: post.tips_count,
                        tipsSum: post.tips_sum,
                        conversionRate: post.conversion_rate,
                        uniqueImpressions: post.unique_impressions,
                        views: post.views,
                        uniqueViews: post.unique_views
                      }}
                      query={query}
                      postId={post.id}
                      isMyPost={userId === post.user?.id}
                      isLiked={post.isLiked}
                      likes={post.likes_count}
                      comments={post.comment_count}
                      setCommentsActive={setCommentsActive}
                      // setActivePost={() =>
                      //   setSelectedPostData(post)
                      // }
                    />
                  </>
                )}
                <SinglePostPreviewVideo
                  mediaItem={item}
                  postFile={postFile}
                  minimized={minimized}
                  isFirstPost={isFirstPost}
                  isActive={index === activeSlide}
                  showControls={showControls}
                  toggleControls={toggleControls}
                  videoUserId={post.user?.id}
                />
              </SwiperSlide>
            )
          } else if (item.url.includes('/sounds/originals')) {
            return (
              <SwiperSlide key={index} className={`${!showControls || minimized ? 'swiper-no-swiping' : ''}`}>
                <MinimizeIcon {...{ minimized, post, showControls }} onClick={() => minimizeFn(index, 'sound')} />
                {showControls && !minimized && (
                  <>
                    <ShowMore
                      userId={postFile.userId}
                      name={postFile.name}
                      time={someTimeAgo(post.created_at)}
                      tags={['#bowieblue', '#bluechowchow']}
                      text={postFile.text ? postFile.text : ''}
                      mentions={postFile.mentions}
                    />
                    <PreviewActions
                      // userId={userId}
                      // filter={filter}
                      stats={{
                        overallRevenue: post.overall_revenue,
                        purchasesCount: post.purchases_count,
                        purchasesSum: post.purchases_sum,
                        tipsCount: post.tips_count,
                        tipsSum: post.tips_sum,
                        conversionRate: post.conversion_rate,
                        uniqueImpressions: post.unique_impressions,
                        views: post.views,
                        uniqueViews: post.unique_views
                      }}
                      query={query}
                      postId={post.id}
                      isMyPost={userId === post.user?.id}
                      isLiked={post.isLiked}
                      likes={post.likes_count}
                      comments={post.comment_count}
                      setCommentsActive={setCommentsActive}
                      // setActivePost={() =>
                      //   setSelectedPostData(post)
                      // }
                    />
                  </>
                )}
                <SinglePostPreviewAudio
                  mediaItem={item}
                  postFile={postFile}
                  minimized={minimized}
                  isFirstPost={isFirstPost}
                  isActive={index === activeSlide}
                  showControls={showControls}
                  toggleControls={toggleControls}
                />
              </SwiperSlide>
            )
          } else {
            return <div className='preview__video'>Whatever</div>
          }
        })}
      </Swiper>
    </div>
  )
}

export default SinglePostPreviewMedia
