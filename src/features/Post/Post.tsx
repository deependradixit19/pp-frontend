import { FC, useState, useRef } from 'react'
import ReactPlayer from 'react-player'
import { InfiniteData, useQueryClient } from 'react-query'
import { Carousel } from 'react-responsive-carousel'
import { useTranslation } from 'react-i18next'
import { duration } from 'dayjs'
import { usePreviewContext } from '../../context/previewContext'
import { useAnswerPoll, useEngagePost, useTipPost } from '../../helpers/hooks'
import { IFile } from '../../types/interfaces/IFile'
import { IInfinitePage, IPost, ITipPayload } from '../../types/interfaces/ITypes'
import PostPoll from './components/PostPoll'
import AudioMessage from '../../components/UI/AudioMessage/AudioMessage'
import './_post.scss'
import PremiumPost from './components/PremiumPost/PremiumPost'
import PostGoal from './components/PostGoal'
import PostStory from './components/PostStory/PostStory'
import { IconPostPauseOutline, IconPostPlayOutline, IconUpcomingLive } from '../../assets/svg/sprite'
import { formatedDate, formatVideoTime } from '../../lib/dayjs'
import { renderPostText } from '../../helpers/postHelpers'
import { pagedPostEngageMutationOptions } from '../../helpers/mutationOptions'
import PostVideo from './components/PostVideo/PostVideo'
import PostAudio from './components/PostAudio/PostAudio'
import { useUserContext } from '../../context/userContext'
import CaptionText from '../PhotoEdit/CaptionText/CaptionText'

interface Props {
  postIndex: number
  role: string
  postData: IPost
  dataQuery: any[]
  isMyPost: boolean
  allFiles: IFile[]
  purchaseProcessing: boolean
  purchasePostCb: (postId: number) => void
  updateCounter: (key: number) => void
  toggleStats: () => void
}

const Post: FC<Props> = ({
  postIndex,
  role,
  postData,
  dataQuery,
  isMyPost,
  allFiles,
  purchasePostCb,
  purchaseProcessing,
  updateCounter,
  toggleStats
}) => {
  // const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
  const [activeStorySlide, setActiveStorySlide] = useState<number | null>(null)

  const previewData = usePreviewContext()
  const userData = useUserContext()

  const queryClient = useQueryClient()
  const { setPollAnswer } = useAnswerPoll({})
  const { setPostTip } = useTipPost({ onMutate: val => onTipMutate(val) })
  const { t } = useTranslation()
  const { engagePost } = useEngagePost(
    postData.id,
    postData.is_engage,
    pagedPostEngageMutationOptions(queryClient, dataQuery)
  )

  const cachedData = queryClient.getQueryData<InfiniteData<IInfinitePage>>(dataQuery)

  const onTipMutate = (tipAmount: number) => {
    engagePost()
    if (cachedData) {
      const newData = {
        ...cachedData,
        pages: cachedData.pages.map(singleFeedPage => {
          return {
            ...singleFeedPage,
            page: {
              ...singleFeedPage.page,
              data: {
                ...singleFeedPage.page.data,
                data: singleFeedPage.page.data.data.map(post =>
                  post.goal && post.id === postData.id
                    ? {
                        ...post,
                        goal: {
                          ...post.goal,
                          tipped: post.goal?.tipped + tipAmount
                        }
                      }
                    : post
                )
              }
            }
          }
        })
      }

      queryClient.setQueryData(dataQuery, newData)
    }
  }

  const onTipPost = (val: number) => {
    const payload: ITipPayload = {
      amount: val.toString(),
      post_id: postData.id,
      payment_method: userData.default_payment_method === 'wallet' ? 'deposit' : userData.default_payment_method
    }

    if (userData.default_payment_method === 'card' && userData.default_card) {
      payload.card_id = userData.default_card
    }

    engagePost()
    setPostTip.mutate(payload, {
      onError: () => onMutateError()
    })
  }

  const onMutateError = () => {
    queryClient.setQueryData(dataQuery, cachedData)
  }

  const renderSounds = () => {
    if (postData.sounds.length) {
      return (
        <div className='post-sound-container'>
          {postData?.sounds.map((sound: any) =>
            sound.url ? (
              <AudioMessage
                audioBlob={sound.url}
                audioReady={true}
                waveColor='gray'
                waveBackgroundColor='transparent'
                key={sound.id}
              />
            ) : null
          )}
        </div>
      )
    }
    return null
  }

  const getInitialSlide = () => {
    const initialSlide = postData.stories?.findIndex(story => !story.seen)
    if (initialSlide !== -1) {
      return initialSlide
    } else {
      return postData.stories.length - 1
    }
  }

  if (postData.price && !postData.is_purchased) {
    return (
      <PremiumPost
        postData={postData}
        postIndex={postIndex}
        dataQuery={dataQuery}
        // previewEnabled={false}
        // previewUrl={CoverBg}
        processing={purchaseProcessing}
        purchaseCb={() => {
          purchasePostCb(postData.id)
          engagePost()
        }}
      />
    )
  }

  if (postData.poll)
    return (
      <>
        <div
          style={{
            backgroundImage: postData.poll?.background_color
              ? postData.poll?.background_color
              : `url(${postData.poll?.background_src})`
          }}
          className={`post__files__file post__files__file--poll`}
          onClick={() => {
            if (previewData.minimized) {
              previewData.updateSelectedPost(postIndex, 0, 'poll', postData, dataQuery)
              previewData.handleMinimize(false)
            } else {
              previewData.addModal(postIndex, 0, 'poll', postData, dataQuery)
            }
            engagePost()
          }}
        >
          <PostPoll
            pollData={postData.poll}
            setAnswer={ans => {
              setPollAnswer.mutate(ans, {
                onSettled: () => queryClient.invalidateQueries(dataQuery)
              })
              engagePost()
            }}
            isMyPost={isMyPost}
          />
        </div>
      </>
    )
  if (postData.goal)
    return (
      <>
        <div
          style={{
            backgroundImage: postData.goal?.background_color
              ? postData.goal?.background_color
              : `url(${postData.goal?.background_src})`
          }}
          className={`post__files__file post__files__file--poll`}
          onClick={event => {
            engagePost()
            const el = event.target as HTMLElement
            if (el.classList.contains('goalBox__options') || el.classList.contains('goalBox__option')) {
              return
            }
            if (previewData.minimized) {
              previewData.updateSelectedPost(postIndex, 0, 'goal', postData, dataQuery)
              previewData.handleMinimize(false)
            } else {
              previewData.addModal(postIndex, 0, 'goal', postData, dataQuery)
            }
          }}
        >
          <PostGoal
            goalData={postData.goal}
            setTip={val => onTipPost(val)}
            isMyPost={role === 'owner'}
            disabled={setPostTip.isLoading}
          />
        </div>
      </>
    )
  if (postData.stories && !!postData.stories.length) {
    return (
      <div
        onClick={() => {
          engagePost()
          if (previewData.minimized) {
            previewData.updateSelectedPost(postIndex, activeStorySlide, 'story', postData, dataQuery)
            previewData.handleMinimize(false)
          } else {
            previewData.addModal(postIndex, activeStorySlide, 'story', postData, dataQuery)
          }
        }}
      >
        <PostStory
          storyData={postData.stories.slice(0).reverse()}
          dataQuery={dataQuery}
          initialSlide={getInitialSlide()}
          avatarUrl={postData.user.avatar.url}
          author={postData.user.display_name}
          time={postData.created_at}
          statsAmount={postData.overall_revenue}
          setActiveStorySlide={(idx: number) => setActiveStorySlide(idx)}
          toggleStats={toggleStats}
        />
      </div>
    )
  }
  if (postData.live) {
    return (
      <div className='post-tags-wrapper'>
        <div className='post__files__carousel'>
          <div
            className={`post__files__file post__files__file--img`}
            onClick={() => {
              engagePost()
              if (previewData.minimized) {
                previewData.updateSelectedPost(postIndex, 0, 'live', postData, dataQuery)
                previewData.handleMinimize(false)
              } else {
                previewData.addModal(postIndex, 0, 'live', postData, dataQuery)
              }
            }}
          >
            <img src={postData.live.img_url} alt='Live post background' />
            {postData.live.schedule_date && (
              <div className='post__files__file__upcoming'>
                <IconUpcomingLive />
                <p>{t('upcomingLiveStream')}</p>
                <div className='post__files__file__upcoming__date'>
                  {formatedDate(postData.live.schedule_date, 'MMM D, h:mm A')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!!allFiles.length) {
    return (
      <>
        {allFiles.length === 1 && allFiles[0].url.includes('/sounds') ? (
          <PostAudio
            url={allFiles[0].url}
            updateSelectedPost={() => {
              engagePost()
              if (previewData.minimized) {
                previewData.updateSelectedPost(postIndex, 0, 'sound', postData, dataQuery)
                previewData.handleMinimize(false)
              } else {
                previewData.addModal(postIndex, 0, 'sound', postData, dataQuery)
              }
            }}
          />
        ) : (
          // <div
          //   className={`post__files__file post__files__file--sound`}
          //   onClick={() => {
          //     if (previewData.minimized) {
          //       previewData.updateSelectedPost(
          //         postIndex,
          //         0,
          //         'sound',
          //         postData,
          //         dataQuery
          //       );
          //       previewData.handleMinimize(false);
          //     } else {
          //       previewData.addModal(
          //         postIndex,
          //         0,
          //         'sound',
          //         postData,
          //         dataQuery
          //       );
          //     }
          //   }}
          // >
          //   {renderSounds()}
          // </div>
          <div className='post-tags-wrapper'>
            <Carousel
              axis='horizontal'
              autoPlay={true}
              interval={600000}
              showArrows={false}
              showIndicators={false}
              infiniteLoop={true}
              showThumbs={false}
              showStatus={false}
              className='post__files__carousel'
              onChange={key => {
                updateCounter(key)
                engagePost()
              }}
            >
              {allFiles
                .filter((file: IFile) => file.url.includes('/video') || file.url.includes('/image'))
                .map((file: IFile, key: number) => {
                  if (file.url.includes('/image')) {
                    return (
                      <div
                        key={key}
                        className={`post__files__file ${
                          !allFiles.find((file: IFile) => file.url.includes('/video')) ? 'post__files__file--img' : ''
                        }`}
                        onClick={() => {
                          if (previewData.minimized) {
                            previewData.updateSelectedPost(postIndex, key, 'photo', postData, dataQuery)
                            previewData.handleMinimize(false)
                          } else {
                            console.log('from post query', dataQuery)
                            console.log({ postIndex })
                            console.log({ postData })
                            previewData.addModal(postIndex, key, 'photo', postData, dataQuery)
                          }
                        }}
                      >
                        <img src={file.url} alt='Post file' />
                        {file.text?.value ? (
                          <CaptionText
                            text={`${file.text?.value}`}
                            xPercent={file?.text?.x ?? 50}
                            yPercent={file.text?.y ?? 50}
                          />
                        ) : (
                          ''
                        )}
                      </div>
                    )
                  } else if (file.url.includes('/video')) {
                    return (
                      <PostVideo
                        thumbnail={file.active_thumb}
                        key={key}
                        url={file.url}
                        updateSelectedPost={() => {
                          if (previewData.minimized) {
                            previewData.updateSelectedPost(postIndex, key, 'video', postData, dataQuery)
                            previewData.handleMinimize(false)
                          } else {
                            console.log('from post query', dataQuery)
                            console.log({ postIndex })
                            console.log({ postData })
                            previewData.addModal(postIndex, key, 'video', postData, dataQuery)
                          }
                        }}
                        videoId={file.id}
                        videoUserId={postData.user_id}
                        shouldTrackPlayedS
                      />
                    )
                  } else {
                    return <div key={key}>other</div>
                  }
                })}
            </Carousel>
            {renderSounds()}
          </div>
        )}
      </>
    )
  }

  return (
    <div
      className={`post__files__file post__files__file--img post__files__file--no-media`}
      id={postData.id.toString()}
      onClick={() => {
        if (previewData.minimized) {
          previewData.updateSelectedPost(postIndex, 0, 'text', postData, dataQuery)
          previewData.handleMinimize(false)
        } else {
          previewData.addModal(postIndex, 0, 'text', postData, dataQuery)
        }
      }}
    >
      <p>{renderPostText(postData.body || '', postData.tags)}</p>
    </div>
  )
}
export default Post
