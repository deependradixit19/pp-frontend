import { FC } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { useQueryClient } from 'react-query'
import { produce } from 'immer'
import { Link } from 'react-router-dom'
import { IconThreeDots } from '../../../../assets/svg/sprite'
import { IPost } from '../../../../types/interfaces/ITypes'

import MediaItemSidebar from '../MediaItemSidebar/MediaItemSidebar'
import PostInfoBottom from '../../../../features/Post/components/PostInfoBottom/PostInfoBottom'
import styles from './mediaItem.module.scss'
import { orderMediaFiles } from '../../../../helpers/media'
import { useLikePost, useMediaCounters } from '../../../../helpers/hooks'
import MediaItemProfile from './components/MediaItemProfile/MediaItemProfile'
import MediaItemAudio from './components/MediaItemAudio/MediaItemAudio'
import MediaItemVideo from './components/MediaItemVideo/MediaItemVideo'
import MediaItemLive from './components/MediaItemLive/MediaItemLive'
import MediaItemPoll from './components/MediaItemPoll/MediaItemPoll'
import { renderPostText } from '../../../../helpers/postHelpers'
import { Swiper as SwiperClass } from 'swiper'

interface Props {
  postData: IPost
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  setIsActive: () => void
}

const MediaItem: FC<Props> = ({ postData, isOpen, setIsOpen, setIsActive }) => {
  const queryClient = useQueryClient()
  const { counter, handleUpdateCounters, handleUpdatePreviewCounters } = useMediaCounters(postData)

  const { media, previews } = orderMediaFiles(postData)

  const onLikeMutate = async () => {
    await queryClient.cancelQueries(['getMediaData'])
    const previousData = queryClient.getQueryData<{
      like: IPost[]
      purchases: IPost[]
      watched: IPost[]
    }>(['getMediaData'])
    const newData = produce(previousData, draft => {
      const likedPostToToggle: IPost | undefined = draft?.like.find((post: IPost) => post.id === postData.id)
      if (likedPostToToggle) {
        if (likedPostToToggle.isLiked) {
          likedPostToToggle.isLiked = false
          likedPostToToggle.likes_count = likedPostToToggle.likes_count - 1
        } else {
          likedPostToToggle.isLiked = true
          likedPostToToggle.likes_count = likedPostToToggle.likes_count + 1
        }
      }
      const purchasedPostToToggle: IPost | undefined = draft?.purchases.find((post: IPost) => post.id === postData.id)
      if (purchasedPostToToggle) {
        if (purchasedPostToToggle.isLiked) {
          purchasedPostToToggle.isLiked = false
          purchasedPostToToggle.likes_count = purchasedPostToToggle.likes_count - 1
        } else {
          purchasedPostToToggle.isLiked = true
          purchasedPostToToggle.likes_count = purchasedPostToToggle.likes_count + 1
        }
      }
      const watchedPostToToggle: IPost | undefined = draft?.watched.find((post: IPost) => post.id === postData.id)
      if (watchedPostToToggle) {
        if (watchedPostToToggle.isLiked) {
          watchedPostToToggle.isLiked = false
          watchedPostToToggle.likes_count = watchedPostToToggle.likes_count - 1
        } else {
          watchedPostToToggle.isLiked = true
          watchedPostToToggle.likes_count = watchedPostToToggle.likes_count + 1
        }
      }
    })
    queryClient.setQueryData(['getMediaData'], newData)

    return { previousData }
  }
  const onLikeError = (err: any, context: any) => {
    queryClient.setQueryData(['getMediaData'], context.previousData)
  }
  const onLikeSettled = () => {
    queryClient.invalidateQueries(['getMediaData'])
  }

  const { likePost } = useLikePost(postData.id, onLikeMutate, onLikeError, onLikeSettled)

  if (postData.poll) {
    return (
      <div onClick={setIsActive} className={`${styles.wrapper}`}>
        <div>
          <div className={styles.sidebar}>
            <MediaItemSidebar likeCb={() => likePost.mutate()} liked={postData.isLiked} count={postData.likes_count} />
          </div>
          <div
            className={`${styles.options} media__options`}
            onClick={e => {
              setIsOpen(!isOpen)
            }}
          >
            <IconThreeDots />
          </div>
          <Link to={`/post/${postData.id}`}>
            <div className={`post__files__file--poll ${styles.poll}`}>
              <MediaItemPoll poll={postData.poll} />
              <PostInfoBottom
                postId={postData.id}
                role='owner'
                price={null}
                mediaCount={counter}
                hideCounter={false}
                countOnly={false}
              />
            </div>
          </Link>
        </div>
        <MediaItemProfile
          userId={postData.user_id}
          avatarUrl={postData.user.avatar.url}
          name={postData.user.name}
          createdAt={postData.created_at}
        />
      </div>
    )
  }

  if (postData.live) {
    return <MediaItemLive live={postData.live} />
  }

  if (postData.price && !!previews.length) {
    return (
      <div onClick={setIsActive} className={styles.wrapper}>
        <div className={styles.sliderWrapper}>
          <Swiper
            spaceBetween={10}
            slidesPerView='auto' // was 4
            onSlideChange={(swiper: SwiperClass) => {
              handleUpdatePreviewCounters(swiper.activeIndex)
            }}
          >
            {previews &&
              previews.length &&
              previews.map((data, idx) => (
                <SwiperSlide key={idx} style={{ width: '100%' }}>
                  <div className={styles.sidebar}>
                    <MediaItemSidebar
                      likeCb={() => likePost.mutate()}
                      liked={postData.isLiked}
                      count={postData.likes_count}
                    />
                  </div>
                  <div
                    className={styles.options}
                    onClick={() => {
                      setIsOpen(!isOpen)
                    }}
                  >
                    <IconThreeDots />
                  </div>
                  <Link to={`/post/${postData.id}`}>
                    <div className={styles.media}>
                      {data.preview.type === 'clip' && <MediaItemVideo url={data.preview.src} />}
                      {(data.preview.type === 'thumb' || data.preview.type === 'blur') && (
                        <img src={data.preview.src} alt='media' />
                      )}
                      {/* {(data.type === 'audio' || data.type === 'sound') && (
                      <MediaItemAudio url={data.url} />
                      )} */}
                      <PostInfoBottom
                        postId={postData.id}
                        role='owner'
                        price={null}
                        mediaCount={counter}
                        hideCounter={false}
                        countOnly={false}
                      />
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
        <MediaItemProfile
          userId={postData.user_id}
          avatarUrl={postData.user.avatar.url}
          name={postData.user.name}
          createdAt={postData.created_at}
        />
      </div>
    )
  }

  if (media && !!media.length) {
    return (
      <div onClick={setIsActive} className={styles.wrapper}>
        <div className={styles.sliderWrapper}>
          {/* {media.length === 1 && media[0].url.includes('/sounds')} */}
          <Swiper
            spaceBetween={10}
            slidesPerView='auto' // was 4
            onSlideChange={(swiper: SwiperClass) => {
              handleUpdateCounters(swiper.activeIndex)
            }}
          >
            {media &&
              !!media.length &&
              media.map((data, idx) => {
                return (
                  <SwiperSlide key={idx} style={{ width: '100%' }}>
                    <div className={styles.sidebar}>
                      <MediaItemSidebar
                        likeCb={() => likePost.mutate()}
                        liked={postData.isLiked}
                        count={postData.likes_count}
                      />
                    </div>
                    <div
                      className={`${styles.options} media__options`}
                      onClick={e => {
                        setIsOpen(!isOpen)
                      }}
                    >
                      <IconThreeDots />
                    </div>
                    <Link to={`/post/${postData.id}`}>
                      <div className={`${styles.media}`}>
                        {data.type === 'video' && <MediaItemVideo url={data.url} />}
                        {data.type === 'photo' && <img src={data.url} alt='media' />}
                        {(data.type === 'audio' || data.type === 'sound') && <MediaItemAudio url={data.url} />}
                        <PostInfoBottom
                          postId={postData.id}
                          role='owner'
                          price={null}
                          mediaCount={counter}
                          hideCounter={false}
                          countOnly={false}
                        />
                      </div>
                    </Link>
                  </SwiperSlide>
                )
              })}
          </Swiper>
        </div>
        <MediaItemProfile
          userId={postData.user_id}
          avatarUrl={postData.user.avatar.url}
          name={postData.user.name}
          createdAt={postData.created_at}
        />
      </div>
    )
  }

  return (
    <div onClick={setIsActive} className={styles.wrapper}>
      <div className={styles.text}>
        <div className={styles.sidebar}>
          <MediaItemSidebar likeCb={() => likePost.mutate()} liked={postData.isLiked} count={postData.likes_count} />
        </div>
        <div
          className={`${styles.options} media__options`}
          onClick={() => {
            setIsOpen(!isOpen)
          }}
        >
          <IconThreeDots />
        </div>
        <Link to={`/post/${postData.id}`}>
          <div className={styles.media}>
            <p>{renderPostText(postData.body || '', postData.tags)}</p>
            <PostInfoBottom
              postId={postData.id}
              role='owner'
              price={null}
              mediaCount={counter}
              hideCounter={false}
              countOnly={false}
            />
          </div>
        </Link>
      </div>
      <MediaItemProfile
        userId={postData.user_id}
        avatarUrl={postData.user.avatar.url}
        name={postData.user.name}
        createdAt={postData.created_at}
      />
    </div>
  )
}

export default MediaItem
