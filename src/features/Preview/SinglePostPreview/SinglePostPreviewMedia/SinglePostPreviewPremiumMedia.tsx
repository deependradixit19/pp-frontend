import { FC, useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Zoom } from 'swiper/modules'
import { Swiper as SwiperClass } from 'swiper'

// Import Swiper styles
import 'swiper/css/bundle'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from 'react-query'
import ShowMore from '../../../../components/Common/ShowMore/ShowMore'
import { someTimeAgo } from '../../../../lib/dayjs'
import { IPost, IPostMediaPreview } from '../../../../types/interfaces/ITypes'
import { MinimizeIcon } from '../../Preview'
import PreviewActions from '../../PreviewActions/PreviewActions'
import styles from './singlePostPreview.module.scss'
import placeholderAvatar from '../../../../assets/images/user_placeholder.png'
import { usePreviewContext } from '../../../../context/previewContext'
import { renderPostText } from '../../../../helpers/postHelpers'
import ImagePreview from '../../ImagePreview'
import { IconPremiumPostLockedOutline } from '../../../../assets/svg/sprite'
import Button from '../../../../components/UI/Buttons/Button'
import VideoPlayer from '../../../VideoPlayer/VideoPlayer'
import { purchasePremiumPost } from '../../../../services/endpoints/posts'
import { extractMedia } from '../../../../helpers/media'

interface Props {
  post: IPost
  showControls: boolean
  isFirstPost: boolean
  hasNextPage: boolean
  minimizeFn: (fileIndex: number, type: string) => void
  toggleControls: () => void
}

const SinglePostPreviewPremiumMedia: FC<Props> = ({
  post,
  showControls,
  isFirstPost,
  hasNextPage,
  minimizeFn,
  toggleControls
}) => {
  const [activeSlide, setActiveSlide] = useState<number | null>(null)

  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { userId, query, selectedSlide, minimized, setCommentsActive } = usePreviewContext()

  const purchasePost = useMutation(
    (postId: number) => {
      return purchasePremiumPost(postId)
    },
    {
      onMutate: resData => {},
      onSettled: () => {
        queryClient.invalidateQueries(query)
      }
    }
  )

  const postFile = {
    userId: post.user_id,
    name: post.user?.display_name,
    text: post.body,
    mentions: post.tags,
    media: extractMedia(post),
    minimizedName: post.user?.display_name,
    minimizedAvatar: post.user?.cropped_avatar?.url ?? post.user?.avatar?.url ?? placeholderAvatar
  }

  const previewFiles = [...post.photos_preview, ...post.videos_preview]

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
        {previewFiles.map((item: IPostMediaPreview, index: number) => {
          if (item.preview.type === 'thumb' || item.preview.type === 'blur') {
            const orientation = item.preview.orientation ? item.preview.orientation.toLowerCase() : ''

            return (
              <SwiperSlide key={index} className={`${!showControls || minimized ? 'swiper-no-swiping' : ''}`}>
                <MinimizeIcon {...{ minimized, post, showControls }} onClick={() => minimizeFn(index, 'image')} />
                {showControls && !minimized && (
                  <>
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
                    <ShowMore
                      userId={postFile.userId}
                      name={postFile.name}
                      time={someTimeAgo(post.created_at)}
                      tags={['#bowieblue', '#bluechowchow']}
                      text={postFile.text ? postFile.text : ''}
                      mentions={postFile.mentions}
                    />
                  </>
                )}
                <div onClick={() => toggleControls()} className={`preview__file ${orientation}`}>
                  {minimized ? (
                    <div className='preview__minimized'>
                      <img
                        className='preview__file__image preview__file__image--minimized'
                        src={item.preview.src}
                        alt={t('preview')}
                      />
                      <div className='preview__minimized__content'>
                        <div className='preview__minimized__content--top'>
                          <div className='header__avatar'>
                            <img src={postFile.minimizedAvatar} alt={t('placeholder')} />
                          </div>
                          <div className='header__name'>{postFile.minimizedName}</div>
                        </div>
                        <div className='preview__minimized__content--bottom'>
                          <div className='content__text'>{renderPostText(postFile.text || '', postFile.mentions)}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img className='preview__background' src={item.preview.src} alt={t('background')} />
                      <ImagePreview
                        src={item.preview.src}
                        // textObject={item.text}
                      />
                      <div className='post__cta'>
                        <div className='post__cta__icon'>
                          <IconPremiumPostLockedOutline />
                        </div>
                        <p className='post__cta__text'>{t('premium')}</p>
                        <Button
                          text={
                            <p>
                              {t('buy')} <span className='post__cta__button__price'>${post.price}</span>2
                            </p>
                          }
                          color='black'
                          font='mont-14-normal'
                          height='3'
                          width='fit'
                          padding='2'
                          customClass='post__cta__button'
                          clickFn={() => purchasePost.mutate(post?.id)}
                          disabled={purchasePost.isLoading}
                        />
                      </div>
                    </>
                  )}
                  {!hasNextPage && <div className='preview__file__last'>{t('noMorePosts')}</div>}
                </div>
              </SwiperSlide>
            )
          } else if (item.preview.type === 'clip') {
            return (
              <SwiperSlide key={index} className={`${!showControls || minimized ? 'swiper-no-swiping' : ''}`}>
                <MinimizeIcon {...{ minimized, post, showControls }} onClick={() => minimizeFn(index, 'video')} />
                {showControls && !minimized && (
                  <>
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
                    <ShowMore
                      userId={postFile.userId}
                      name={postFile.name}
                      time={someTimeAgo(post.created_at)}
                      tags={['#bowieblue', '#bluechowchow']}
                      text={postFile.text ? postFile.text : ''}
                      mentions={postFile.mentions}
                    />
                  </>
                )}
                <div className={`preview__file ${item.preview.orientation}`}>
                  {minimized ? (
                    <div className='preview__minimized'>
                      <VideoPlayer
                        url={item.preview.src}
                        showControls={true}
                        minimized={minimized}
                        setShowControls={toggleControls}
                        isActive={index === activeSlide}
                        shouldTrackPlayed={true}
                        videoId={item.id}
                        videoUserId={post.user?.id}
                      />
                      <div className='preview__minimized__content'>
                        <div className='preview__minimized__content--top'>
                          <div className='header__avatar'>
                            <img src={postFile.minimizedAvatar} alt={t('placeholder')} />
                          </div>
                          <div className='header__name'>{postFile.minimizedName}</div>
                        </div>
                        <div className='preview__minimized__content--bottom'>
                          <div className='content__text'>
                            {renderPostText(postFile.text || '', postFile.mentions)}
                            {/* {postFile.text} */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <VideoPlayer
                        url={item.preview.src}
                        showControls={showControls}
                        minimized={minimized}
                        setShowControls={toggleControls}
                        isActive={index === activeSlide}
                        shouldTrackPlayed={true}
                        videoId={item.id}
                        videoUserId={post.user?.id}
                      />
                      <div className='post__cta'>
                        <div className='post__cta__icon'>{/* <IconPremiumPostLockedOutline /> */}</div>
                        <p className='post__cta__text'>{t('premium')}</p>
                        <Button
                          text={
                            <p>
                              {t('buy')} <span className='post__cta__button__price'>${post.price}</span>
                            </p>
                          }
                          color='black'
                          font='mont-14-normal'
                          height='3'
                          width='fit'
                          padding='2'
                          customClass='post__cta__button'
                          clickFn={() => purchasePost.mutate(post?.id)}
                          disabled={purchasePost.isLoading}
                        />
                      </div>
                    </>
                  )}
                  {!hasNextPage && <div className='preview__file__last'>{t('noMorePosts')}</div>}
                </div>
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

export default SinglePostPreviewPremiumMedia
