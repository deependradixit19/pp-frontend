import { FC, useCallback, useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperClass } from 'swiper'

import { InfiniteData, useQueryClient } from 'react-query'
import { produce } from 'immer'
import styles from './postStory.module.scss'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
import { IInfinitePage } from '../../../../types/interfaces/ITypes'
import { useAnswerPoll, useStoryLike, useStorySeen } from '../../../../helpers/hooks'
import AvatarHolder from '../../../../components/UI/AvatarHolder/AvatarHolder'
import placeholderAvatar from '../../../../assets/images/user_placeholder.png'
import { someTimeAgo } from '../../../../lib/dayjs'
import PostPoll from '../PostPoll'
import CaptionText from '../../../PhotoEdit/CaptionText/CaptionText'
import { Story } from '../../../../types/types'
import PostStorySidebar from './PostStorySidebar/PostStorySidebar'
import { useUserContext } from '../../../../context/userContext'

interface Props {
  storyData: Story[]
  dataQuery: any[]
  initialSlide: number
  avatarUrl: string | null
  author: string
  time: string
  statsAmount: number
  hideHeader?: boolean
  isPreview?: boolean
  setActiveStorySlide?: (idx: number) => void
  toggleStats: () => void
}

export interface IProgress {
  id: number
  duration: number
  seen: boolean
}
interface IProgresBarProps {
  progressList: IProgress[]
  activeIndex: number
  active: boolean
}
export const ProgressBar: FC<IProgresBarProps> = ({ progressList, activeIndex, active }) => {
  const handleStoryActive = (active: boolean) => {
    return active ? 'running' : 'paused'
  }
  const checkIsStorySeen = (storyIdx: number, seen: boolean) => {
    if (storyIdx < activeIndex || (activeIndex === progressList.length - 1 && seen)) return styles.passed
  }
  return (
    <div className={styles.progressBar}>
      {progressList.map((progress, idx) => {
        return (
          <div
            key={idx}
            style={{
              animationDuration: `${progress.duration}s`,
              animationPlayState: `${handleStoryActive(active)}`
            }}
            className={`${styles.progress} ${idx === activeIndex ? styles.active : ''} ${checkIsStorySeen(
              idx,
              progress.seen
            )}`}
          ></div>
        )
      })}
    </div>
  )
}

const PostStory: FC<Props> = ({
  storyData,
  dataQuery,
  initialSlide,
  avatarUrl,
  author,
  time,
  statsAmount,
  hideHeader = false,
  isPreview = false,
  setActiveStorySlide,
  toggleStats
}) => {
  const [activeSlide, setActiveSlide] = useState(initialSlide)
  const [progressList, setProgressList] = useState<IProgress[]>([])
  const [autoplay, setAutoplay] = useState(false)

  const userData = useUserContext()
  const observer = useRef<IntersectionObserver>()
  const swiperRef = useRef() as any
  const slideDurationRef = useRef<number>()
  const slideDurationCurrentRef = useRef<number>()
  const intervalRef = useRef<NodeJS.Timeout>()
  const queryClient = useQueryClient()
  const { setPollAnswer } = useAnswerPoll({})

  const cachedData = queryClient.getQueryData<InfiniteData<IInfinitePage>>(dataQuery)
  const { storySeenMutation } = useStorySeen({
    onMutate: (vars: any) => {
      const newData = produce(cachedData, draft => {
        draft?.pages.forEach(page => {
          page.page.data.data.forEach(post => {
            const story = post.stories?.find(story => story.id === vars.storyId)
            if (story && !story.seen) story.seen = true
          })
        })
      })

      queryClient.setQueryData(dataQuery, newData)
    },
    onError: () => {
      queryClient.setQueryData(dataQuery, cachedData)
    }
  })

  const { storyLikeMutation } = useStoryLike({
    onMutate: (vars: any) => {
      const newData = produce(cachedData, draft => {
        draft?.pages.forEach(page => {
          page.page.data.data.forEach(post => {
            const story = post.stories?.find(story => story.id === vars.storyId)
            if (story) {
              story.liked = !story.liked

              if (story.liked) {
                story.like_count = story.like_count + 1
              } else {
                story.like_count = story.like_count - 1
              }
            }
          })
        })
      })

      queryClient.setQueryData(dataQuery, newData)
    },
    onError: () => {
      queryClient.setQueryData(dataQuery, cachedData)
    }
  })

  useEffect(() => {
    const tmpProg = storyData.map(story => {
      return {
        id: story.id,
        duration: story.duration,
        seen: story.seen
      }
    })
    setProgressList(tmpProg)
  }, [storyData])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (autoplay) {
        let current = slideDurationCurrentRef.current
        if (current) {
          slideDurationCurrentRef.current = current - 100
        }

        if (swiperRef.current.isEnd) {
          if (current === 0) {
            autoplay && setAutoplay(false)
          }
        } else {
          if (current === 0) {
            swiperRef.current.slideNext()
          }
        }
      }
    }, 100)
    return () => {
      intervalRef.current && clearInterval(intervalRef.current)
    }
  }, [autoplay])

  const viewportRef = useCallback(
    (node: any) => {
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            const tmpUnseen = storyData.find(story => !story.seen)

            if (swiperRef.current.isEnd) {
              if (slideDurationCurrentRef.current && slideDurationCurrentRef.current > 0) {
                if (tmpUnseen) {
                  !autoplay && setAutoplay(true)
                }
              }
            } else {
              !autoplay && setAutoplay(true)
            }
          } else {
            setAutoplay(false)
          }
        },
        { rootMargin: '0px 0px 0px 0px', threshold: 1.0 }
      )

      if (node) observer.current.observe(node)
    },
    [autoplay]
  )

  // const getStoryDuration = (story: Story) => {
  //   if (story.image_src) return 3;
  //   return 5;
  // };

  const convertStoriesInProgressList = (stories: Story[]): IProgress[] => {
    const tmpProg = stories.map((story: Story) => {
      return {
        id: story.id,
        duration: story.duration,
        seen: story.seen
      }
    })

    return tmpProg
  }

  const renderStory = (story: Story, index: number) => {
    const { liked, like_count } = story
    if (story.image_src && !story.poll) {
      return (
        <div className={styles.storySlide}>
          <PostStorySidebar
            isEnabled={true}
            showStats={userData?.role === 'model'}
            amount={statsAmount}
            liked={liked}
            likeCount={like_count}
            toggleStats={toggleStats}
            toggleLiked={() => storyLikeMutation.mutate({ storyId: story.id })}
          />
          <img src={story.image_src} alt='' />
          {story.text?.value && (
            <CaptionText text={story.text.value ?? ''} xPercent={story.text.x ?? 50} yPercent={story.text.y ?? 50} />
          )}
        </div>
      )
    } else if (story.video_src) {
      return (
        <div className={styles.storySlide}>
          <PostStorySidebar
            isEnabled={true}
            showStats={userData?.role === 'model'}
            amount={statsAmount}
            liked={liked}
            likeCount={like_count}
            toggleStats={toggleStats}
            toggleLiked={() => storyLikeMutation.mutate({ storyId: story.id })}
          />
          <ReactPlayer
            width='100%'
            height='100%'
            url={story.video_src}
            controls={false}
            playing={autoplay && index === activeSlide}
            muted
            playsinline={true}
          />
        </div>
      )
    } else {
      return (
        <div className={styles.storySlide}>
          <PostStorySidebar
            isEnabled={true}
            showStats={userData?.role === 'model'}
            amount={statsAmount}
            liked={liked}
            likeCount={like_count}
            toggleStats={toggleStats}
            toggleLiked={() => storyLikeMutation.mutate({ storyId: story.id })}
          />
          <div
            style={{
              backgroundImage: story.background_color ? story.background_color : `url(${story.image_src})`
            }}
            className={`post__files__file post__files__file--poll`}
          >
            {story.poll && (
              <PostPoll
                pollData={story.poll}
                setAnswer={ans =>
                  ans &&
                  setPollAnswer.mutate(ans, {
                    onSettled: () => queryClient.invalidateQueries(dataQuery)
                  })
                }
                isMyPost={false}
              />
            )}
            {story.text?.value && (
              <CaptionText text={story.text.value ?? ''} xPercent={story.text.x ?? 50} yPercent={story.text.y ?? 50} />
            )}
          </div>
        </div>
      )
    }
  }
  const handleStorySeen = (id: number) => {
    storySeenMutation.mutate({ storyId: id })
  }

  return (
    <div
      ref={viewportRef}
      className={`${styles.box} ${isPreview ? styles.preview : ''}`}
      onMouseOver={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      <ProgressBar progressList={progressList} activeIndex={activeSlide} active={autoplay} />
      {!hideHeader && (
        <div className={styles.header}>
          <div className={styles.avatar}>
            <AvatarHolder img={avatarUrl || placeholderAvatar} size='36' />
          </div>
          <div className={styles.content}>
            <div className={styles.author}>{author}</div>
            <div className={styles.time}>{someTimeAgo(storyData[activeSlide].created_at)}</div>
          </div>
        </div>
      )}

      <div className={styles.container}>
        {storyData && storyData.length && (
          <Swiper
            onInit={(swiper: SwiperClass) => {
              setActiveStorySlide && setActiveStorySlide(swiper.activeIndex)
              swiperRef.current = swiper
              slideDurationRef.current = storyData[initialSlide].duration * 1000
              // getStoryDuration(storyData[initialSlide]) * 1000;
              slideDurationCurrentRef.current = storyData[initialSlide].duration * 1000
              // getStoryDuration(storyData[initialSlide]) * 1000;
            }}
            onSlideChange={(swiper: SwiperClass) => {
              setActiveSlide(swiper.activeIndex)
              setActiveStorySlide && setActiveStorySlide(swiper.activeIndex)
              if (storyData.length > 1) {
                if (swiper.activeIndex >= 1) {
                  !storyData[swiper.activeIndex - 1].seen && handleStorySeen(storyData[swiper.activeIndex - 1].id)
                }
              }

              slideDurationRef.current = storyData[swiper.activeIndex].duration * 1000
              // getStoryDuration(storyData[swiper.activeIndex]) * 1000;
              slideDurationCurrentRef.current = storyData[swiper.activeIndex].duration * 1000
              // getStoryDuration(storyData[swiper.activeIndex]) * 1000;
              if (swiper.previousIndex === storyData.length - 1) {
                !autoplay && setAutoplay(true)
              }
              if (swiper.isEnd) {
                if (!storyData[swiper.activeIndex].seen) {
                  handleStorySeen(storyData[swiper.activeIndex].id)
                }
              }
            }}
            speed={100}
            initialSlide={activeSlide}
            loop={false}
            className={styles.storySlider}
          >
            {storyData.map((story, index) => {
              return <SwiperSlide key={index}>{renderStory(story, index)}</SwiperSlide>
            })}
          </Swiper>
        )}
      </div>
    </div>
  )
}

export default PostStory
